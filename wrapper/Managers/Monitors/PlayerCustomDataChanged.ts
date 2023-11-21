import { NetworkedParticle } from "../../Base/NetworkedParticle"
import { Runes } from "../../Data/GameData"
import { DOTA_CHAT_MESSAGE } from "../../Enums/DOTA_CHAT_MESSAGE"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { Team } from "../../Enums/Team"
import { alchemist_goblins_greed } from "../../Objects/Abilities/Alchemist/alchemist_goblins_greed"
import { bounty_hunter_jinada } from "../../Objects/Abilities/BountyHunter/bounty_hunter_jinada"
import { doom_bringer_devour } from "../../Objects/Abilities/DoomBringer/doom_bringer_devour"
import { flagbearer_creep_aura_effect } from "../../Objects/Abilities/FlagbearerCreep/flagbearer_creep_aura_effect"
import { Ability } from "../../Objects/Base/Ability"
import { AetherRemnant } from "../../Objects/Base/AetherRemnant"
import { Building } from "../../Objects/Base/Building"
import { Courier } from "../../Objects/Base/Courier"
import { Creep } from "../../Objects/Base/Creep"
import { Entity, GameRules } from "../../Objects/Base/Entity"
import { FakeUnit } from "../../Objects/Base/FakeUnit"
import { Hero } from "../../Objects/Base/Hero"
import { Item } from "../../Objects/Base/Item"
import { Modifier } from "../../Objects/Base/Modifier"
import { CPlayerResource } from "../../Objects/Base/PlayerResource"
import { TeamData } from "../../Objects/Base/TeamData"
import { Unit } from "../../Objects/Base/Unit"
import { WardObserver } from "../../Objects/Base/WardObserver"
import { AbilityData } from "../../Objects/DataBook/AbilityData"
import { GPMCounter, PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { npc_dota_hero_arc_warden } from "../../Objects/Heroes/npc_dota_hero_arc_warden"
import { npc_dota_hero_vengefulspirit } from "../../Objects/Heroes/npc_dota_hero_vengefulspirit"
import { item_enchanted_mango } from "../../Objects/Items/item_enchanted_mango"
import { item_faerie_fire } from "../../Objects/Items/item_faerie_fire"
import { item_hand_of_midas } from "../../Objects/Items/item_hand_of_midas"
import { item_philosophers_stone } from "../../Objects/Items/item_philosophers_stone"
import { item_tpscroll } from "../../Objects/Items/item_tpscroll"
import { arrayRemove, orderByRevert } from "../../Utils/ArrayExtensions"
import { GameState } from "../../Utils/GameState"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"

const enum Tier {
	None,
	TowerT1,
	TowerT2,
	TowerT3,
	TowerT4
}

const buildingData = new (class CBuildingData {
	// https://dota2.fandom.com/wiki/Gold#Buildings
	private readonly bonusTowerGold = 20
	private readonly baseTowerGolds = [90, 110, 125, 145]

	protected get IsTurbo() {
		return (
			GameRules !== undefined &&
			GameRules.GameMode === DOTAGameMode.DOTA_GAMEMODE_TURBO
		)
	}

	public GetGoldTower(name: string, isDeny = false) {
		const tier = this.GetTowerTierByName(name)
		if (tier < 1) {
			throw `Invalid tier: ${tier}`
		}
		let gold = this.baseTowerGolds[tier - 1]
		if (isDeny) {
			gold /= 2
		}
		if (this.IsTurbo) {
			gold *= 2
		}
		return gold
	}

	public GetAverageGoldTower(name: string) {
		const min = this.GetGoldTower(name) + this.bonusTowerGold
		const max = min + this.bonusTowerGold
		return (min + max) / 2
	}

	public GetGoldBarracks(isMelee: boolean) {
		let gold = isMelee ? 155 : 90
		if (this.IsTurbo) {
			gold *= 2
		}
		return gold
	}

	public GetAverageGoldBarrack(_isMelee: boolean) {
		const min = 90
		const max = 135
		let gold = (min + max) / 2
		if (this.IsTurbo) {
			gold *= 2
		}
		return gold
	}

	// ex: Filler
	// Effigy_Statue maybe removed
	public EffigyLastHit() {
		let gold = 68
		if (this.IsTurbo) {
			gold *= 2
		}
		return gold
	}

	public GetTowerTierByName(name: string): Tier {
		if (!name.length) {
			throw `Invalid tower name: ${name}`
		}
		switch (true) {
			case name.includes("tower1"):
				return Tier.TowerT1
			case name.includes("tower2"):
				return Tier.TowerT2
			case name.includes("tower3"):
				return Tier.TowerT3
			case name.endsWith("tower4"):
				return Tier.TowerT4
			default:
				throw `Invalid tower name: ${name}`
		}
	}
})()

const Monitor = new (class PlayerDataCustomChanged {
	private fakeGoldHandOfMidas = 160
	private readonly playersItems = new Map<number, Item[]>()
	private readonly queueIllusion = new Map<Hero, [Unit, number]>()
	private readonly uniqueIllusion = [
		"modifier_darkseer_wallofreplica_illusion",
		"modifier_phantom_lancer_juxtapose_illusion"
	]

	private get IsTurbo() {
		return (
			GameRules !== undefined &&
			GameRules.GameMode === DOTAGameMode.DOTA_GAMEMODE_TURBO
		)
	}

	// Events
	public PostDataUpdate() {
		if (GameRules?.IsPaused) {
			return
		}
		for (const playerData of PlayerCustomData.Array) {
			playerData.PostDataUpdate()
		}
	}

	public PlayerResourceUpdated() {
		PlayerCustomData.PlayerResourceUpdated()
	}

	// Events
	public ChatEvent(
		typeMessage: DOTA_CHAT_MESSAGE,
		value: number,
		value2: number,
		value3: number,
		...args: number[] // players (PlayerID)
	) {
		switch (typeMessage) {
			case DOTA_CHAT_MESSAGE.CHAT_MESSAGE_HERO_KILL:
				this.killHeroMessageChanged(value, value2, value3, ...args)
				break
			case DOTA_CHAT_MESSAGE.CHAT_MESSAGE_ROSHAN_KILL:
				this.killRoshanMessageChanged(value, value2, value3, ...args)
				break
			case DOTA_CHAT_MESSAGE.CHAT_MESSAGE_COURIER_LOST:
				this.killCourierMessageChanged(value, value2, value3, ...args)
				break
		}
	}

	// Events
	public GameEvent(name: string, obj: any) {
		switch (name) {
			case "dota_buyback":
				PlayerCustomData.get(obj.player_id)?.SetBuyBack()
				break
			case "entity_killed":
				this.lastHitAndGoldChanged(obj.entindex_killed, obj.entindex_attacker)
				break
			case "entity_hurt":
				this.addIllusionOrClone(
					obj.entindex_killed,
					obj.entindex_attacker,
					obj.server_tick
				)
				break
		}
	}

	// Events
	public GameStarted() {
		this.queueIllusion.clear()
	}

	// Events
	public PreEntityCreated(entity: Entity) {
		if (entity.IsGameRules) {
			this.changeDetectedUnload()
		}
		if (entity instanceof TeamData) {
			this.teamDataChanged(entity)
		}
	}

	public EntityCreated(entity: Entity) {
		if (entity.IsGameRules) {
			this.changeDetectedUnload()
		}
		if (entity instanceof Item) {
			this.entityItemsCreated(entity)
		}
	}

	// Events
	public EntityDestroyed(entity: Entity) {
		if (entity instanceof CPlayerResource) {
			PlayerCustomData.DeleteAll()
		}
		if (entity instanceof TeamData) {
			this.teamDataChanged(entity, true)
		}
		if (entity instanceof Hero && entity.IsRealHero) {
			PlayerCustomData.Delete(entity.PlayerID)
		}
		if (entity instanceof Item) {
			this.totalItemsDestroyed(entity)
		}
	}

	// Events
	public ModifierChanged(modifier: Modifier, destroyed?: boolean) {
		const parent = modifier.Parent
		const ability = modifier.Ability
		if (parent === undefined || !(ability instanceof Ability)) {
			return
		}
		let playerID = parent.PlayerID
		if (playerID === -1) {
			playerID = parent.OwnerPlayerID // example: courier
		}
		const playerData = PlayerCustomData.get(playerID)
		if (playerData === undefined || playerData.Hero === undefined) {
			return
		}
		if (modifier.Name === "modifier_kobold_tunneler_prospecting_aura_money") {
			if (destroyed) {
				playerData.DeleteCounter(modifier.Name)
				return
			}
			if (ability.Name === "kobold_tunneler_prospecting") {
				const gpm = ability.GetSpecialValue("gpm_aura", modifier.AbilityLevel)
				playerData.AddCounter(modifier.Name, new GPMCounter(gpm))
			}
		}
	}

	// Events
	public LifeStateChanged(entity: Entity) {
		this.illusionOrCloneChanged(entity)
	}

	// Events
	public ParticleCreated(option: NetworkedParticle) {
		switch (option.PathNoEcon) {
			case "particles/generic_gameplay/rune_bounty_owner.vpcf":
				this.bountyRunesParticleChanged(option)
				break
			case "particles/units/heroes/hero_doom_bringer/doom_bringer_devour.vpcf":
				this.devourParticleChanged(option)
				break
		}
	}

	// Events
	public ParticleUpdated(option: NetworkedParticle) {
		switch (option.PathNoEcon) {
			case "particles/items2_fx/hand_of_midas.vpcf":
				this.handOfMidasParticleChanged(option)
				break
			case "particles/units/heroes/hero_bounty_hunter/bounty_hunter_jinada.vpcf":
				this.jinadaParticleChanged(option)
				break
		}
	}

	// Events
	public PlayerCustomDataUpdated(playerData: PlayerCustomData) {
		if (!playerData.IsValid) {
			this.playersItems.delete(playerData.PlayerID)
		}
	}

	// Events
	public UnitItemsChanged(unit: Unit) {
		if (!unit.IsEnemy() || unit.IsClone || unit.IsIllusion) {
			return
		}
		let playerID = unit.PlayerID
		if (playerID === -1) {
			playerID = unit.OwnerPlayerID // example: courier
		}
		const playerData = PlayerCustomData.get(playerID)
		if (playerData === undefined || playerData.Hero === undefined) {
			return
		}

		if (!playerData.IsValid) {
			this.playersItems.delete(playerID)
			return
		}

		this.philosophersStoneChanged(playerData)

		const items = !unit.IsHero ? unit.TotalItems : playerData.Hero.TotalItems
		const newTotalItems = items.filter(x => x !== undefined && x.Cost !== 0) as Item[]
		if (!newTotalItems.length) {
			return
		}

		let oldItems = this.playersItems.get(playerID)
		if (oldItems === undefined) {
			if (playerData.IsChangeDetectedUnload) {
				this.newItemsChanged(newTotalItems, [], playerData)
			}

			oldItems = newTotalItems
			this.playersItems.set(playerID, oldItems)

			for (const item of oldItems) {
				switch (!playerData.IsChangeDetectedUnload) {
					case item instanceof item_tpscroll:
						playerData.ItemsGold += item.Cost
						break
					case playerData.HasRandomed &&
						(item instanceof item_enchanted_mango ||
							item instanceof item_faerie_fire):
						playerData.ItemsGold += item.Cost
						break
				}
			}
		}

		this.newItemsChanged(newTotalItems, oldItems, playerData)
	}

	// TODO: neutral creeps
	private lastHitAndGoldChanged(indexKilled: number, indexAttacker: number) {
		if (GameRules === undefined) {
			return
		}

		const target = EntityManager.EntityByIndex(indexKilled)
		const attacker = EntityManager.EntityByIndex(indexAttacker)
		if (!(target instanceof Unit) || !(attacker instanceof Unit)) {
			return
		}

		if (target instanceof AetherRemnant) {
			return
		}

		if (target instanceof Building) {
			this.killBuildingChanged(attacker, target)
			return
		}

		if (target.IsHero || target.IsRoshan) {
			return
		}

		const attackerData = PlayerCustomData.get(attacker.PlayerID)
		if (attackerData === undefined) {
			return
		}

		//  don't nothing, use dota chat message or any event
		if (target.IsClone || target.IsIllusion || target instanceof Courier) {
			return
		}

		if (!attackerData.IsEnemy(target)) {
			attackerData.DenyCount++
			return
		}

		let averageGold = !this.IsTurbo
			? target.GoldBountyAverage
			: target.GoldBountyAverage * 2

		// https://dota2.fandom.com/wiki/Gold#Wards
		// GoldBountyAverage for ward observer equals every 100 gold
		// (100 + 100) / 2 = 100
		if (target instanceof WardObserver) {
			averageGold += (GameRules.GameTime / 60) * (!this.IsTurbo ? 4 : 8)
		}

		if (
			GameRules.GameTime >= 7 * 60 &&
			target instanceof Creep &&
			target.IsLaneCreep
		) {
			// see: https://dota2.fandom.com/wiki/Gold#Lane_creeps
			averageGold += this.calculateGoldCreepByTime(
				GameRules.GameTime,
				target.IsSuperCreep || target.IsMegaCreep
			)
		}

		const flagbearerAura = target.GetAbilityByClass(flagbearer_creep_aura_effect)
		if (flagbearerAura !== undefined) {
			for (const player of PlayerCustomData.Array) {
				if (player.Team !== attacker.Team) {
					continue
				}
				if (attackerData.PlayerID === attacker.PlayerID) {
					continue
				}
				if (player.Distance2D(target) <= flagbearerAura.AOERadius) {
					player.UnreliableGold += averageGold + flagbearerAura.BonusGold
				}
			}
			if (attacker.Distance2D(target) <= flagbearerAura.AOERadius) {
				averageGold += flagbearerAura.BonusGold
			}
		}

		attackerData.UnreliableGold += averageGold
		attackerData.LastHitCount++
	}

	private illusionOrCloneChanged(entity: Entity) {
		if (!(entity instanceof Hero) || entity.IsAlive) {
			return
		}

		const data = this.queueIllusion.get(entity)
		if (data === undefined) {
			return
		}

		const [killer, lasTick] = data
		if (GameState.CurrentServerTick - lasTick > 1 / 30) {
			this.queueIllusion.delete(entity)
			return
		}

		const getPlayerData = PlayerCustomData.get(killer.PlayerID)
		if (getPlayerData === undefined) {
			return
		}

		if (
			entity.IsClone &&
			killer.IsEnemy(entity) &&
			entity instanceof npc_dota_hero_arc_warden
		) {
			// NOT DATA: every 6 levels add 60 gold
			const goldPerLevel = 60
			const increments = Math.floor(entity.Level / 6)
			const totalAddGold = entity.Level === 6 ? 180 : increments * goldPerLevel
			getPlayerData.UnreliableGold += Math.max(totalAddGold, 300)
			this.queueIllusion.delete(entity)
			return
		}

		// don't give gold hybrid illusion (wtf?)
		if (entity.IsClone && entity instanceof npc_dota_hero_vengefulspirit) {
			this.queueIllusion.delete(entity)
			return
		}

		if (entity.IsClone || !entity.IsIllusion) {
			this.queueIllusion.delete(entity)
			return
		}

		// https://dota2.fandom.com/wiki/Illusions - Bounty
		// Spirit Lance, Wall of Replica, Doppelganger
		// Juxtapose (created by Phantom Lancer and from his illusions)
		if (entity.HasAnyBuffByNames(this.uniqueIllusion)) {
			getPlayerData.UnreliableGold += 5
			this.queueIllusion.delete(entity)
			return
		}

		const multiplierByLevel = 2
		const goldIllusionByLevel = Math.floor(entity.Level * multiplierByLevel)
		getPlayerData.UnreliableGold += goldIllusionByLevel
		this.queueIllusion.delete(entity)
	}

	private addIllusionOrClone(
		indexKilled: number,
		indexAttacker: number,
		serverTick: number
	) {
		const target = EntityManager.EntityByIndex(indexKilled)
		const attacker = EntityManager.EntityByIndex(indexAttacker)
		if (attacker === target) {
			return
		}

		if (!(target instanceof Hero) || !(attacker instanceof Unit)) {
			return
		}

		if (!attacker.IsEnemy(target) || attacker.PlayerID === -1) {
			return
		}

		const getPlayerData = PlayerCustomData.get(attacker.PlayerID)
		if (getPlayerData === undefined) {
			return
		}

		if (target.IsIllusion || target.IsClone) {
			this.queueIllusion.set(target, [attacker, serverTick])
		}
	}

	private bountyRunesParticleChanged(option: NetworkedParticle) {
		if (GameRules === undefined) {
			return
		}
		const owner = option.AttachedTo
		let reliableGold = Runes.CalculateGoldBountyByTime(GameRules.GameTime)
		if (this.IsTurbo) {
			reliableGold *= 2
		}
		if (owner instanceof FakeUnit) {
			if (owner.PlayerCustomData === undefined) {
				return
			}
			const name = owner.PlayerCustomData.HeroName
			if (name === "npc_dota_hero_alchemist") {
				// if turbo, don't give gold, calculated before
				reliableGold *= this.IsTurbo ? 1 : 2
			}
			owner.PlayerCustomData.ReliableGold += reliableGold
			return
		}
		if (owner === undefined || owner.IsIllusion || owner.IsClone) {
			return
		}
		const playerData = PlayerCustomData.get(owner.PlayerID)
		if (playerData === undefined || playerData.Hero === undefined) {
			return
		}
		// if turbo, don't give gold, calculated before
		if (!this.IsTurbo) {
			const greed = playerData.Hero.GetAbilityByClass(alchemist_goblins_greed)
			const multiplier = greed?.GetSpecialValue("bounty_multiplier") ?? 1
			reliableGold *= multiplier
		}
		playerData.ReliableGold += reliableGold
	}

	// see: https://dota2.fandom.com/wiki/Gold#Abilities
	private devourParticleChanged(option: NetworkedParticle) {
		const ent = option.AttachedTo
		if (ent === undefined) {
			return
		}
		if (ent instanceof FakeUnit) {
			if (ent.PlayerCustomData === undefined) {
				return
			}
			const name = "doom_bringer_devour"
			const abilData = AbilityData.GetAbilityByName(name)
			if (abilData === undefined) {
				return
			}
			// necessary improve at GameEvent for level?
			// example case: doom farm jungle and not visible first 5-10min (without entity)
			ent.PlayerCustomData.AddGoldAfterTime(
				abilData.GetSpecialValue("bonus_gold", 1),
				abilData.GetMaxCooldownForLevel(1)
			)
			return
		}
		if (ent === undefined || ent.IsIllusion || ent.IsClone) {
			return
		}
		const playerData = PlayerCustomData.get(ent.PlayerID)
		if (playerData === undefined || playerData.Hero === undefined) {
			return
		}
		if (playerData === undefined || playerData.Hero === undefined) {
			return
		}
		const devour = playerData.Hero.GetAbilityByClass(doom_bringer_devour)
		if (devour === undefined) {
			return
		}
		const gold = devour.GetSpecialValue("bonus_gold")
		playerData.AddGoldAfterTime(gold, devour.MaxCooldown)
	}

	// see: https://dota2.fandom.com/wiki/Bounty_Hunter#Jinada
	private jinadaParticleChanged(option: NetworkedParticle) {
		const targetEnt = option.ControlPointsEnt.get(0)
		const casterEnt = option.ControlPointsEnt.get(1)
		if (casterEnt === undefined || targetEnt === undefined) {
			return
		}
		if (!(targetEnt[0] instanceof Hero) || !(casterEnt[0] instanceof Hero)) {
			return
		}
		const casterPlayerData = PlayerCustomData.get(casterEnt[0].PlayerID)
		const targetPlayerData = PlayerCustomData.get(targetEnt[0].PlayerID)
		if (casterPlayerData === undefined || targetPlayerData === undefined) {
			return
		}
		if (casterPlayerData.Hero === undefined || targetPlayerData.Hero === undefined) {
			return
		}
		const jinada = casterPlayerData.Hero.GetAbilityByClass(bounty_hunter_jinada)
		if (jinada === undefined) {
			return
		}
		const gold = jinada.GetSpecialValue("gold_steal")
		const goldSteal = Math.min(targetPlayerData.NetWorth, gold)
		casterPlayerData.UnreliableGold += goldSteal
		targetPlayerData.SubtractGold(goldSteal)
	}

	// see: https://dota2.fandom.com/wiki/Gold#Hero_kills
	private killHeroMessageChanged(
		gold: number,
		betweenGold: number,
		betweenPlayers: number,
		...args: number[]
	) {
		const target = PlayerCustomData.get(args[0])
		const killer = PlayerCustomData.get(args[1])
		if (target === undefined) {
			return
		}
		const targetHero = target.Hero
		if (targetHero === undefined) {
			return
		}
		if (!this.IsTurbo) {
			target.UnreliableGold -= target.GoldLossOnDeath
		}
		const addBetweenGold = (exlcudePlayerID?: number) => {
			const players = PlayerCustomData.Array.filter(
				x => x.IsEnemy(targetHero) && x.PlayerID !== exlcudePlayerID
			)
			const orderByPlayers = orderByRevert(
				players,
				x =>
					x.Hero !== undefined &&
					(x.Hero.IsVisible || x.Hero.Distance2D(targetHero) <= 1500)
			)
			const arrPlayers = orderByPlayers.filter((_, i) => i + 1 <= betweenPlayers)
			const goldBetweenBonus = (betweenGold / arrPlayers.length) >> 0
			for (const player of arrPlayers) {
				player.UnreliableGold += goldBetweenBonus
			}
		}

		if (killer === undefined) {
			const players = PlayerCustomData.Array.filter(x => x.IsEnemy(targetHero))
			const goldAllTeam = (gold / players.length) >> 0
			for (const player of players) {
				player.UnreliableGold += goldAllTeam
			}
			if (betweenGold === 0) {
				return
			}
			addBetweenGold()
			return
		}

		if (betweenGold !== 0) {
			addBetweenGold(killer.PlayerID)
			killer.UnreliableGold += gold
			return
		}
		killer.UnreliableGold += gold
	}

	// see: https://dota2.fandom.com/wiki/Gold#Abilities
	private handOfMidasParticleChanged(option: NetworkedParticle) {
		const caster = option.ControlPointsEnt.get(1)
		if (caster === undefined || caster[0] === undefined) {
			return
		}
		if (caster[0] instanceof FakeUnit) {
			if (caster[0].PlayerCustomData === undefined) {
				return
			}
			caster[0].PlayerCustomData.UnreliableGold += !this.IsTurbo
				? this.fakeGoldHandOfMidas
				: this.fakeGoldHandOfMidas * 2
			return
		}
		const playerData = PlayerCustomData.get(caster[0].PlayerID)
		if (playerData === undefined || playerData.Hero === undefined) {
			return
		}
		const midas = playerData.Hero.GetItemByClass(item_hand_of_midas)
		if (midas === undefined) {
			return
		}
		const gold = midas.GetSpecialValue("bonus_gold")
		playerData.UnreliableGold += !this.IsTurbo ? gold : gold * 2
	}

	// see: https://dota2.fandom.com/wiki/Gold#Neutral_creeps
	private killRoshanMessageChanged(
		gold: number,
		_value2: number,
		_value3: number,
		...args: number[]
	) {
		// we do not calculate gold (for team) for turbo we know in the chat
		const [killerPlayerId, killerTeam] = args
		this.addUnreliableGoldTeam(gold, killerTeam)

		const killer = PlayerCustomData.get(killerPlayerId)
		if (killer === undefined) {
			return
		}
		let min = 200
		let max = min + 90
		if (this.IsTurbo) {
			min *= 2
			max *= 2
		}
		const total = (min + max) / 2
		killer.UnreliableGold += total
	}

	// see: https://dota2.fandom.com/wiki/Gold#Couriers
	private killCourierMessageChanged(
		gold: number,
		_value2: number,
		_value3: number,
		...args: number[]
	) {
		// couriers cannot be killed in Turbo
		const [, courierTeam] = args
		const team = courierTeam === Team.Dire ? Team.Radiant : Team.Dire
		this.addUnreliableGoldTeam(gold, team)
	}

	private teamDataChanged(entity: TeamData, destroyed = false) {
		if (!destroyed) {
			PlayerCustomData.TeamData.add(entity)
			return
		}
		PlayerCustomData.TeamData.delete(entity)
	}

	private killBuildingChanged(killer: Unit, target: Building) {
		const team = killer.Team
		const isDeny = !killer.IsEnemy(target)
		const reverseTeam = team === Team.Dire ? Team.Radiant : Team.Dire

		const playerData = PlayerCustomData.get(killer.PlayerID)
		if (playerData === undefined) {
			if (target.IsTower) {
				const goldTower = buildingData.GetGoldTower(target.Name, isDeny)
				this.addUnreliableGoldTeam(goldTower, team)
				return
			}
			if (target.IsBarrack) {
				const goldBarrack = buildingData.GetGoldBarracks(target.IsRanged)
				this.addUnreliableGoldTeam(goldBarrack, team)
				return
			}
			if (target.IsHeroStatue) {
				const goldStatueLH = buildingData.EffigyLastHit()
				this.addUnreliableGoldTeam(goldStatueLH, team)
				return
			}
			return
		}

		if (target.IsTower) {
			const goldTower = buildingData.GetGoldTower(target.Name, isDeny)
			if (isDeny) {
				this.addUnreliableGoldTeam(goldTower, reverseTeam)
				return
			}
			const goldTowerLH = buildingData.GetAverageGoldTower(target.Name)
			playerData.UnreliableGold += goldTowerLH
			this.addUnreliableGoldTeam(goldTower, team)
		}

		if (target.IsBarrack) {
			const goldBarrack = buildingData.GetGoldBarracks(target.IsRanged)
			if (isDeny) {
				this.addUnreliableGoldTeam(goldBarrack, reverseTeam)
				return
			}
			const goldBarrackLH = buildingData.GetAverageGoldBarrack(target.IsRanged)
			playerData.UnreliableGold += goldBarrackLH
			this.addUnreliableGoldTeam(goldBarrack, team)
		}

		if (target.IsHeroStatue) {
			const goldStatueLH = buildingData.EffigyLastHit()
			playerData.UnreliableGold += isDeny ? 0 : goldStatueLH
		}
	}

	private addUnreliableGoldTeam(gold: number, team: Team) {
		for (const playerData of PlayerCustomData.Array) {
			if (playerData.Team === team) {
				playerData.UnreliableGold += gold
			}
		}
	}

	private totalItemsDestroyed(item: Item) {
		const owner = item.Owner
		if (owner === undefined || !owner.IsEnemy()) {
			return
		}
		if (owner.IsClone || owner.IsIllusion) {
			return
		}
		let playerID = owner.PlayerID
		if (playerID === -1) {
			playerID = owner.OwnerPlayerID // example: courier
		}
		const playerData = PlayerCustomData.get(playerID)
		if (playerData === undefined) {
			return
		}
		const getPlayerItem = this.playersItems.get(playerData.PlayerID)
		if (getPlayerItem === undefined) {
			return
		}
		const findItem = getPlayerItem.find(pItem => pItem === item)
		if (findItem === undefined) {
			return
		}
		const itemQuality = findItem.AbilityData.ItemQuality
		const allowedQuality =
			itemQuality === "rare" ||
			itemQuality === "epic" ||
			itemQuality === "common" ||
			itemQuality === "artifact" ||
			itemQuality === "consumable"
		if (allowedQuality) {
			playerData.ItemsGold -= item.Cost
			arrayRemove(getPlayerItem, item)
		}
	}

	private entityItemsCreated(item: Item) {
		const owner = item.Owner
		if (owner === undefined || !owner.IsEnemy()) {
			return
		}
		if (owner.IsClone || owner.IsIllusion) {
			return
		}
		let playerID = owner.PlayerID
		if (playerID === -1) {
			playerID = owner.OwnerPlayerID // example: courier
		}
		const playerData = PlayerCustomData.get(playerID)
		if (playerData !== undefined) {
			this.UnitItemsChanged(owner)
		}
	}

	private philosophersStoneChanged(playerData: PlayerCustomData) {
		if (playerData.Hero === undefined) {
			return
		}
		const item = playerData.Hero.GetItemByClass(item_philosophers_stone)
		if (item === undefined) {
			playerData.DeleteCounter("item_philosophers_stone")
			return
		}
		const rawGameTime = GameState.RawGameTime
		const newCounter = new GPMCounter(
			item.GetSpecialValue("bonus_gpm"),
			item.EnableTime < rawGameTime ? rawGameTime + 6 : item.EnableTime
		)
		playerData.AddCounter(item.Name, newCounter)
	}

	private changeGoldPredctionItems(
		newItem: Item,
		playerData: PlayerCustomData,
		itemRecipeData: AbilityData,
		oldItemsPlayer: Item[]
	) {
		let count = 0
		const lastPurchaseItem = itemRecipeData.ItemRequirements[0].filter(name => {
			const fixName = name.replace("*", "")
			if (oldItemsPlayer.find(oldItem => oldItem.Name === fixName) !== undefined) {
				count++
			}
			return !oldItemsPlayer.some(oldItem => oldItem.Name === fixName)
		})
		for (const oldItem of oldItemsPlayer) {
			if (lastPurchaseItem.some(name => oldItem.Name === name)) {
				arrayRemove(oldItemsPlayer, oldItem)
			}
		}
		const changeGold = (cost: number) => {
			playerData.ItemsGold += cost
			playerData.SubtractGold(cost)
		}
		if (count === 0) {
			changeGold(newItem.Cost)
			return
		}
		for (const name of lastPurchaseItem) {
			changeGold(AbilityData.GetAbilityByName(name)?.Cost ?? 0)
		}
	}

	// https://dota2.fandom.com/wiki/Gold#Lane_creeps
	private calculateGoldCreepByTime(
		gameTime: number,
		isSuperCreep: boolean,
		isTurbo = this.IsTurbo
	) {
		// Increase in gold per minute based on game mode
		let increasePerMinute = isTurbo ? 3 : 1
		// Adjust increase per minute for super creeps
		if (isSuperCreep) {
			increasePerMinute = isTurbo ? 4.5 : 1.5
		}
		// Calculate the increase in gold per second
		const increasePerSecond = increasePerMinute / (60 * 7.5)
		// Calculate the total bounty gold earned based on game time
		const bountyGold = increasePerSecond * gameTime
		// Round down the bounty gold to the nearest integer
		return Math.floor(bountyGold)
	}

	private changeDetectedUnload() {
		for (const playerData of PlayerCustomData.Array) {
			playerData.ChangeDetectedUnload()
		}
	}

	private newItemsChanged(
		newTotalItems: Item[],
		oldItems: Item[],
		playerData: PlayerCustomData
	) {
		for (const newItem of newTotalItems) {
			if (oldItems.includes(newItem)) {
				continue
			}

			oldItems.push(newItem)
			const itemQuality = newItem.AbilityData.ItemQuality
			// TODO: find calculate better way from dupe
			if (newItem.IsCombineLocked) {
				continue
			}

			if (
				itemQuality === "consumable" &&
				newItem.AbilityData.ItemStockInitial !== undefined
			) {
				playerData.ItemsGold += newItem.Cost
				playerData.SubtractGold(newItem.Cost)
				continue
			}

			const tempName = newItem.Name.replace("item_", "item_recipe_")
			const recipeData = AbilityData.GetAbilityByName(tempName)
			const allowedQuality =
				itemQuality === "rare" ||
				itemQuality === "epic" ||
				itemQuality === "common" ||
				itemQuality === "artifact"

			if (recipeData !== undefined && allowedQuality) {
				const recipeCost = recipeData.Cost
				if (recipeCost === 0) {
					this.changeGoldPredctionItems(
						newItem,
						playerData,
						recipeData,
						oldItems
					)
					continue
				}
				playerData.ItemsGold += recipeCost
				playerData.SubtractGold(recipeCost)
				continue
			}

			playerData.ItemsGold += newItem.Cost
			playerData.SubtractGold(newItem.Cost)
		}
	}
})()
EventsSDK.on(
	"LifeStateChanged",
	entity => Monitor.LifeStateChanged(entity),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"UnitItemsChanged",
	entity => Monitor.UnitItemsChanged(entity),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"GameEvent",
	(name, obj) => Monitor.GameEvent(name, obj),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"ChatEvent",
	(type, v1, p1, p2, p3, p4, p5, p6, v2, v3) =>
		Monitor.ChatEvent(type, v1, v2, v3, p1, p2, p3, p4, p5, p6),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"PreEntityCreated",
	entity => Monitor.PreEntityCreated(entity),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"EntityCreated",
	entity => Monitor.EntityCreated(entity),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"EntityDestroyed",
	entity => Monitor.EntityDestroyed(entity),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"ModifierCreated",
	mod => Monitor.ModifierChanged(mod),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"ModifierChanged",
	mod => Monitor.ModifierChanged(mod),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"ParticleCreated",
	particle => Monitor.ParticleCreated(particle),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"ParticleUpdated",
	particle => Monitor.ParticleUpdated(particle),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"ModifierRemoved",
	mod => Monitor.ModifierChanged(mod, true),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"PlayerCustomDataUpdated",
	player => Monitor.PlayerCustomDataUpdated(player),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"PlayerResourceUpdated",
	() => Monitor.PlayerResourceUpdated(),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on("GameStarted", () => Monitor.GameStarted(), Number.MIN_SAFE_INTEGER)

EventsSDK.on("PostDataUpdate", () => Monitor.PostDataUpdate(), Number.MIN_SAFE_INTEGER)
