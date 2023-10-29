import { NetworkedParticle } from "../../Base/NetworkedParticle"
import { Runes } from "../../Data/GameData"
import { DOTA_CHAT_MESSAGE } from "../../Enums/DOTA_CHAT_MESSAGE"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { LaneSelectionFlags } from "../../Enums/LaneSelectionFlags"
import { SOType } from "../../Enums/SOType"
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
import { GPMCounter, Player, Players } from "../../Objects/Base/Player"
import { PlayerPawn } from "../../Objects/Base/PlayerPawn"
import { CPlayerResource } from "../../Objects/Base/PlayerResource"
import { TeamData } from "../../Objects/Base/TeamData"
import { Unit } from "../../Objects/Base/Unit"
import { WardObserver } from "../../Objects/Base/WardObserver"
import { AbilityData } from "../../Objects/DataBook/AbilityData"
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

const enum TowerTier {
	None,
	T1,
	T2,
	T3,
	T4
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

	public GetTowerTierByName(name: string): TowerTier {
		if (!name.length) {
			throw `Invalid tower name: ${name}`
		}
		switch (true) {
			case name.includes("tower1"):
				return TowerTier.T1
			case name.includes("tower2"):
				return TowerTier.T2
			case name.includes("tower3"):
				return TowerTier.T3
			case name.endsWith("tower4"):
				return TowerTier.T4
			default:
				throw `Invalid tower name: ${name}`
		}
	}
})()

const LaneSelection = new (class CPlayerLaneSelection {
	private readonly laneSelection: [number, Nullable<LaneSelectionFlags>][][] = [[], []]

	public SharedObjectChanged(id: SOType, reason: number, msg: RecursiveMap) {
		if (id !== SOType.Lobby) {
			return
		}
		if (reason === 2) {
			this.laneSelection[0] = []
			this.laneSelection[1] = []
		}
		if (reason !== 0) {
			return
		}
		const members = msg.get("all_members") as RecursiveMap[]
		if (members.length > 10) {
			return
		}
		this.laneSelection[0].push(
			[0, LaneSelectionFlags.MID_LANE],
			[1, LaneSelectionFlags.OFF_LANE],
			[2, LaneSelectionFlags.Core],
			[3, LaneSelectionFlags.HARD_SUPPORT],
			[4, LaneSelectionFlags.ALL]
		)

		this.laneSelection[1].push(
			[0, LaneSelectionFlags.MID_LANE],
			[1, LaneSelectionFlags.OFF_LANE],
			[2, LaneSelectionFlags.ALL],
			[3, LaneSelectionFlags.HARD_SUPPORT],
			[4, LaneSelectionFlags.SOFT_SUPPORT]
		)

		// this.laneSelection[0] = members
		// 	.filter(member => member.get("team") === 0)
		// 	.map(member => [
		// 		member.get("slot") as number,
		// 		member.get("lane_selection_flags") as Nullable<LaneSelectionFlags>
		// 	])
		// this.laneSelection[1] = members
		// 	.filter(member => member.get("team") === 1)
		// 	.map(member => [
		// 		member.get("slot") as number,
		// 		member.get("lane_selection_flags") as Nullable<LaneSelectionFlags>
		// 	])
	}

	public PlayerResourceСhanged() {
		for (const player of Players) {
			if (player.PlayerID === -1 || player.TeamSlot === -1) {
				continue
			}
			const currLaneSelections = this.LaneSelectionTeam(player.Team)
			const dataLaneSelections = currLaneSelections.find(
				([slotId]) => slotId === player.TeamSlot
			)
			if (dataLaneSelections !== undefined && dataLaneSelections[1] !== undefined) {
				player.LaneSelectionFlags = dataLaneSelections[1]
				continue
			}
			const playerTeamData = player.PlayerTeamData
			if (playerTeamData === undefined) {
				continue
			}
			let playerTeamDataFlags = playerTeamData.PlayerDraftPreferredRoles
			if (playerTeamDataFlags === undefined) {
				playerTeamDataFlags = playerTeamData.LaneSelectionFlags
			}
			if (playerTeamDataFlags !== undefined) {
				player.LaneSelectionFlags = playerTeamDataFlags
			}
		}
	}

	public GameEvent(playerid1: number, playerid2: number): void {
		const target = Players.find(player => player.PlayerID === playerid1)
		const caster = Players.find(player => player.PlayerID === playerid2)
		if (target === undefined || caster === undefined) {
			return
		}
		const tCurrLaneSelections = this.LaneSelectionTeam(target.Team).find(
			([slotId]) => slotId === target.TeamSlot
		)
		const cCurrLaneSelections = this.LaneSelectionTeam(caster.Team).find(
			([slotId]) => slotId === caster.TeamSlot
		)
		if (
			tCurrLaneSelections === undefined ||
			cCurrLaneSelections === undefined ||
			tCurrLaneSelections[1] !== LaneSelectionFlags.None ||
			cCurrLaneSelections[1] !== LaneSelectionFlags.None
		) {
			return
		}
		tCurrLaneSelections[0] = playerid2
		cCurrLaneSelections[0] = playerid1
	}

	private LaneSelectionTeam(team?: Team) {
		team ??= GameState.LocalTeam
		switch (team) {
			case Team.Radiant:
				return this.laneSelection[1]
			case Team.Dire:
				return this.laneSelection[0]
			default:
				return []
		}
	}
})()

const Monitor = new (class CPlayerGold {
	private fakeGoldHandOfMidas = 160
	private readonly playersItems = new Map<Player, Item[]>()
	private readonly queueIllusion = new Map<Hero, [Player, number]>()
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

	public GameStarted() {
		this.queueIllusion.clear()
	}

	public PostDataUpdate() {
		if (GameRules?.IsPaused) {
			return
		}
		for (const player of Players) {
			player.PostDataUpdate()
		}
	}

	public EntityChanged(entity: Entity, destroyed = false) {
		if (entity instanceof Item && destroyed) {
			this.TotalItemsDestroyed(entity)
		}
		if (entity instanceof CPlayerResource && !destroyed) {
			LaneSelection.PlayerResourceСhanged()
		}
		if (entity instanceof Player && destroyed) {
			this.playersItems.delete(entity)
		}
		if (entity instanceof TeamData) {
			this.teamDataChanged(entity, destroyed)
			return
		}
		if (!(entity instanceof Hero || entity instanceof PlayerPawn)) {
			return
		}
		for (const player of Players) {
			player.UpdateProperties(entity, destroyed)
		}
	}

	public UnitItemsChanged(unit: Unit) {
		if (!unit.IsEnemy()) {
			return
		}
		let caster = unit.Owner
		if (caster === undefined) {
			return
		}
		if (!(caster instanceof Player)) {
			caster = caster.Owner
		}

		this.TotalItemsChanged(caster, unit)

		if (caster instanceof Player) {
			this.philosophersStoneChanged(caster)
		}
	}

	public ModifierChanged(modifier: Modifier, destroyed?: boolean) {
		const parent = modifier.Parent
		const ability = modifier.Ability
		if (parent === undefined || !(ability instanceof Ability)) {
			return
		}

		let player = parent.Owner
		if (player === undefined) {
			return
		}

		if (!(player instanceof Player)) {
			player = player.Owner
		}

		if (!(player instanceof Player)) {
			return
		}

		if (modifier.Name === "modifier_kobold_tunneler_prospecting_aura_money") {
			if (destroyed) {
				player.DeleteCounter(modifier.Name)
				return
			}
			if (ability.Name === "kobold_tunneler_prospecting") {
				const gpm = ability.GetSpecialValue("gpm_aura", modifier.AbilityLevel)
				player.SetCounter(modifier.Name, new GPMCounter(gpm))
			}
		}
	}

	public LifeStateChanged(entity: Entity) {
		this.illusionOrCloneChanged(entity)
	}

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

	public GameEvent(name: string, obj: any) {
		switch (name) {
			case "dota_hero_swap":
				LaneSelection.GameEvent(obj.playerid1, obj.playerid2)
				break
			case "dota_buyback":
				this.findPlayer(obj.entindex)?.SetBuyBack()
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

	public SharedObjectChanged(id: SOType, reason: number, msg: RecursiveMap) {
		LaneSelection.SharedObjectChanged(id, reason, msg)
	}

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

		let killer = attacker.Owner
		if (killer === undefined) {
			return
		}

		if (!(killer instanceof Player)) {
			killer = killer.Owner
		}

		if (!(killer instanceof Player) || target.IsHero || target.IsRoshan) {
			return
		}

		//  don't nothing, use dota chat message or any event
		if (target.IsClone || target.IsIllusion || target instanceof Courier) {
			return
		}

		if (!killer.IsEnemy(target)) {
			killer.DenyCount++
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
			for (const player of Players) {
				if (player.Hero === undefined) {
					continue
				}
				if (player.Hero.Distance2D(target) <= flagbearerAura.AOERadius) {
					averageGold += flagbearerAura.BonusGold
				}
			}
		}

		killer.UnreliableGold += averageGold
		killer.LastHitCount++
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

		if (
			entity.IsClone &&
			killer.IsEnemy(entity) &&
			entity instanceof npc_dota_hero_arc_warden
		) {
			// NOT DATA: every 6 levels add 60 gold
			const goldPerLevel = 60
			const increments = Math.floor(entity.Level / 6)
			const totalAddGold = entity.Level === 6 ? 180 : increments * goldPerLevel
			killer.UnreliableGold += Math.max(totalAddGold, 300)
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
			killer.UnreliableGold += 5
			this.queueIllusion.delete(entity)
			return
		}

		const multiplierByLevel = 2
		const goldIllusionByLevel = Math.floor(entity.Level * multiplierByLevel)
		killer.UnreliableGold += goldIllusionByLevel
		this.queueIllusion.delete(entity)
	}

	// see: https://dota2.fandom.com/wiki/Gold#Hero_kills
	private killHeroMessageChanged(
		gold: number,
		betweenGold: number,
		betweenPlayers: number,
		...args: number[]
	) {
		const target = this.findPlayer(args[0], true)
		const killer = this.findPlayer(args[1], true)
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

		const addBetweenGold = (exlcudePlayer?: Player) => {
			const players = Players.filter(x => x.IsEnemy(target) && x !== exlcudePlayer)
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
			/**
			 * 1. no killer - 700 = (gold(133) / max team players) + (between gold(64) / players(2))
			 * 	= (66 + 32) = 798
			 * 2. no killer - 700 = (gold(133) / max team players) + (between gold(37) / player(1))
			 * 	= (nearest player - if between one player (700 + 66 + 37) = 803)
			 * 	= (other players (700 + 66) = 766)
			 */
			const players = Players.filter(x => x.IsEnemy(target))
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
			addBetweenGold(killer)
			killer.UnreliableGold += gold
			return
		}

		killer.UnreliableGold += gold
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

		const killer = this.findPlayer(killerPlayerId, true)
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

	// see: https://dota2.fandom.com/wiki/Gold#Buildings
	private killBuildingChanged(killer: Unit, target: Building) {
		const team = killer.Team
		const isDeny = !killer.IsEnemy(target)
		const reverseTeam = team === Team.Dire ? Team.Radiant : Team.Dire

		let player = killer.Owner
		if (player === undefined) {
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

		if (!(player instanceof Player)) {
			player = player.Owner // example: Hero
		}

		if (!(player instanceof Player)) {
			return
		}

		if (target.IsTower) {
			const goldTower = buildingData.GetGoldTower(target.Name, isDeny)
			if (isDeny) {
				this.addUnreliableGoldTeam(goldTower, reverseTeam)
				return
			}
			const goldTowerLH = buildingData.GetAverageGoldTower(target.Name)
			player.UnreliableGold += goldTowerLH
			this.addUnreliableGoldTeam(goldTower, team)
			return
		}

		if (target.IsBarrack) {
			const goldBarrack = buildingData.GetGoldBarracks(target.IsRanged)
			if (isDeny) {
				this.addUnreliableGoldTeam(goldBarrack, reverseTeam)
				return
			}
			const goldBarrackLH = buildingData.GetAverageGoldBarrack(target.IsRanged)
			player.UnreliableGold += goldBarrackLH
			this.addUnreliableGoldTeam(goldBarrack, team)
			return
		}

		if (target.IsHeroStatue) {
			const goldStatueLH = buildingData.EffigyLastHit()
			player.UnreliableGold += isDeny ? 0 : goldStatueLH
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
			if (owner.Player === undefined) {
				return
			}
			const name = owner.Player.HeroName
			if (name === "npc_dota_hero_alchemist") {
				// if turbo, don't give gold, calculated before
				reliableGold *= this.IsTurbo ? 1 : 2
			}
			owner.Player.ReliableGold += reliableGold
			return
		}

		if (owner === undefined) {
			return
		}

		let caster = owner.Owner
		if (caster === undefined) {
			return
		}

		if (!(caster instanceof Player)) {
			caster = caster.Owner
		}

		if (!(caster instanceof Player) || caster.Hero === undefined) {
			return
		}

		// if turbo, don't give gold, calculated before
		if (!this.IsTurbo) {
			const greed = caster.Hero.GetAbilityByClass(alchemist_goblins_greed)
			const multiplier = greed?.GetSpecialValue("bounty_multiplier") ?? 1
			reliableGold *= multiplier
		}

		caster.ReliableGold += reliableGold
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

		let caster = casterEnt[0].Owner
		let target = targetEnt[0].Owner
		if (caster === undefined || target === undefined) {
			return
		}

		if (!(target instanceof Player)) {
			target = target.Owner
		}

		if (!(caster instanceof Player)) {
			caster = caster.Owner
		}

		if (!(caster instanceof Player) || !(target instanceof Player)) {
			return
		}

		if (caster.Hero === undefined || target.Hero === undefined) {
			return
		}

		const jinada = caster.Hero.GetAbilityByClass(bounty_hunter_jinada)
		if (jinada === undefined) {
			return
		}
		const gold = jinada.GetSpecialValue("gold_steal")
		const goldSteal = Math.min(target.NetWorth, gold)
		caster.UnreliableGold += goldSteal
		target.SubtractGold(goldSteal)
	}

	// see: https://dota2.fandom.com/wiki/Gold#Abilities
	private handOfMidasParticleChanged(option: NetworkedParticle) {
		const caster = option.ControlPointsEnt.get(1)
		if (caster === undefined || caster[0] === undefined) {
			return
		}

		if (caster[0] instanceof FakeUnit) {
			if (caster[0].Player === undefined) {
				return
			}
			caster[0].Player.UnreliableGold += !this.IsTurbo
				? this.fakeGoldHandOfMidas
				: this.fakeGoldHandOfMidas * 2
			return
		}

		let player = caster[0].Owner
		if (player === undefined) {
			return
		}

		if (!(player instanceof Player)) {
			player = player.Owner
		}

		if (!(player instanceof Player) || player.Hero === undefined) {
			return
		}

		const midas = player.Hero.GetItemByClass(item_hand_of_midas)
		if (midas === undefined) {
			return
		}

		const gold = midas.GetSpecialValue("bonus_gold")
		player.UnreliableGold += !this.IsTurbo ? gold : gold * 2
	}

	// see: https://dota2.fandom.com/wiki/Gold#Abilities
	private devourParticleChanged(option: NetworkedParticle) {
		const ent = option.AttachedTo
		if (ent === undefined) {
			return
		}

		if (ent instanceof FakeUnit) {
			if (ent.Player === undefined) {
				return
			}
			const name = "doom_bringer_devour"
			const abilData = AbilityData.GetAbilityByName(name)
			if (abilData === undefined) {
				return
			}
			// necessary improve at GameEvent for level?
			// example case: doom farm jungle and not visible first 5-10min (without entity)
			ent.Player.AddGoldAfterTime(
				abilData.GetSpecialValue("bonus_gold", 1),
				abilData.GetMaxCooldownForLevel(1)
			)
			return
		}

		let caster = ent.Owner
		if (caster === undefined) {
			return
		}

		if (!(caster instanceof Player)) {
			caster = caster.Owner
		}

		if (!(caster instanceof Player) || caster.Hero === undefined) {
			return
		}

		const devour = caster.Hero.GetAbilityByClass(doom_bringer_devour)
		if (devour === undefined) {
			return
		}

		const gold = devour.GetSpecialValue("bonus_gold")
		caster.AddGoldAfterTime(gold, devour.MaxCooldown)
	}

	private philosophersStoneChanged(player: Player) {
		if (player.Hero === undefined) {
			return
		}
		const item = player.Hero.GetItemByClass(item_philosophers_stone)
		if (item === undefined) {
			player.DeleteCounter("item_philosophers_stone")
			return
		}
		const rawGameTime = GameState.RawGameTime
		const newCounter = new GPMCounter(
			item.GetSpecialValue("bonus_gpm"),
			item.EnableTime < rawGameTime ? rawGameTime + 6 : item.EnableTime
		)
		player.SetCounter(item.Name, newCounter)
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

		let killer = attacker.Owner
		if (killer === undefined) {
			return
		}

		if (!(killer instanceof Player)) {
			killer = killer.Owner
		}

		if (!(killer instanceof Player) || !killer.IsEnemy(target)) {
			return
		}

		if (target.IsIllusion || target.IsClone) {
			this.queueIllusion.set(target, [killer, serverTick])
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

	private teamDataChanged(entity: TeamData, destroyed: boolean) {
		if (!destroyed) {
			Player.TeamData.add(entity)
			return
		}
		Player.TeamData.delete(entity)
	}

	private addUnreliableGoldTeam(gold: number, team: Team) {
		for (const player of Players) {
			if (player.Team === team) {
				player.UnreliableGold += gold
			}
		}
	}

	private findPlayer(ent: number | FakeUnit, byPlayerID = false) {
		if (ent instanceof FakeUnit) {
			return Players.find(player => ent.HandleMatches(player.Hero_))
		}
		return Players.find(player =>
			byPlayerID ? player.PlayerID === ent : player.HandleMatches(ent) ?? false
		)
	}

	// TODO: add after support neutral creeps & fix total
	private TotalItemsChanged(player: Nullable<Entity>, unit: Unit) {
		if (player === undefined || !(player instanceof Player)) {
			return
		}

		if (player.Hero === undefined || !player.IsEnemy()) {
			return
		}

		const newTotalItems = unit.TotalItems.filter(
			x => x !== undefined && x.Cost !== 0
		) as Item[]

		let oldItems = this.playersItems.get(player)
		if (oldItems === undefined) {
			oldItems = newTotalItems
			this.playersItems.set(player, oldItems)
			for (const item of newTotalItems) {
				switch (true) {
					case item instanceof item_tpscroll:
						player.ItemsGold += item.Cost
						break
					case player.HasRandomed &&
						(item instanceof item_enchanted_mango ||
							item instanceof item_faerie_fire):
						player.ItemsGold += item.Cost
						break
				}
			}
		}

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
				player.ItemsGold += newItem.Cost
				player.SubtractGold(newItem.Cost)
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
					this.SetGoldPredctionItems(newItem, player, recipeData, oldItems)
					continue
				}
				player.ItemsGold += recipeCost
				player.SubtractGold(recipeCost)
				continue
			}

			player.ItemsGold += newItem.Cost
			player.SubtractGold(newItem.Cost)
		}
	}

	private SetGoldPredctionItems(
		newItem: Item,
		player: Player,
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
			player.ItemsGold += cost
			player.SubtractGold(cost)
		}
		if (count === 0) {
			changeGold(newItem.Cost)
			return
		}
		for (const name of lastPurchaseItem) {
			changeGold(AbilityData.GetAbilityByName(name)?.Cost ?? 0)
		}
	}

	private TotalItemsDestroyed(item: Item) {
		let player = item.Owner ?? item.Purchaser?.Owner
		if (player === undefined) {
			return
		}
		if (!(player instanceof Player)) {
			player = player.Owner
		}
		if (!(player instanceof Player) || !player.IsEnemy()) {
			return
		}
		const getPlayerItem = this.playersItems.get(player)
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
			player.ItemsGold -= item.Cost
			arrayRemove(getPlayerItem, item)
		}
	}
})()

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
	"LifeStateChanged",
	entity => Monitor.LifeStateChanged(entity),
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
	entity => Monitor.EntityChanged(entity),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"UnitItemsChanged",
	unit => Monitor.UnitItemsChanged(unit),
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
	"ModifierRemoved",
	mod => Monitor.ModifierChanged(mod, true),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"PlayerResourceUpdated",
	() => LaneSelection.PlayerResourceСhanged(),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"SharedObjectChanged",
	(typeID, reason, data) => Monitor.SharedObjectChanged(typeID, reason, data),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on("EntityDestroyed", entity => Monitor.EntityChanged(entity, true))

EventsSDK.on("GameStarted", () => Monitor.GameStarted(), Number.MIN_SAFE_INTEGER)

EventsSDK.on("PostDataUpdate", () => Monitor.PostDataUpdate(), Number.MIN_SAFE_INTEGER)
