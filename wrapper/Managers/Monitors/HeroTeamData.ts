import { NetworkedParticle } from "../../Base/NetworkedParticle"
import { Runes } from "../../Data/GameData"
import { DOTA_CHAT_MESSAGE } from "../../Enums/DOTA_CHAT_MESSAGE"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { Team } from "../../Enums/Team"
import { alchemist_goblins_greed } from "../../Objects/Abilities/Alchemist/alchemist_goblins_greed"
import { bounty_hunter_jinada } from "../../Objects/Abilities/BountyHunter/bounty_hunter_jinada"
import { doom_bringer_devour } from "../../Objects/Abilities/DoomBringer/doom_bringer_devour"
import { AetherRemnant } from "../../Objects/Base/AetherRemnant"
import { Barrack } from "../../Objects/Base/Barrack"
import { Building } from "../../Objects/Base/Building"
import { Courier } from "../../Objects/Base/Courier"
import { Entity, GameRules } from "../../Objects/Base/Entity"
import { FakeUnit } from "../../Objects/Base/FakeUnit"
import { Hero } from "../../Objects/Base/Hero"
import { Player } from "../../Objects/Base/Player"
import { Unit } from "../../Objects/Base/Unit"
import { WardObserver } from "../../Objects/Base/WardObserver"
import { HeroTeamData } from "../../Objects/DataBook/HeroTeamData"
import { npc_dota_hero_arc_warden } from "../../Objects/Heroes/npc_dota_hero_arc_warden"
import { npc_dota_hero_vengefulspirit } from "../../Objects/Heroes/npc_dota_hero_vengefulspirit"
import { item_hand_of_midas } from "../../Objects/Items/item_hand_of_midas"
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

const buildingData = new (class BuildingData {
	// https://dota2.fandom.com/wiki/Gold#Buildings
	private readonly bonusTowerGold = 20
	private readonly baseTowerGolds = [90, 110, 125, 145]
	private readonly towerMapNames = new Map<string, TowerTier>([
		["npc_dota_badguys_tower4", TowerTier.T4],
		["npc_dota_badguys_tower1_mid", TowerTier.T1],
		["npc_dota_badguys_tower2_mid", TowerTier.T2],
		["npc_dota_badguys_tower3_mid", TowerTier.T3],
		["npc_dota_badguys_tower1_bot", TowerTier.T1],
		["npc_dota_badguys_tower2_bot", TowerTier.T2],
		["npc_dota_badguys_tower3_bot", TowerTier.T3],
		["npc_dota_badguys_tower1_top", TowerTier.T1],
		["npc_dota_badguys_tower2_top", TowerTier.T2],
		["npc_dota_badguys_tower3_top", TowerTier.T3]
	])

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
		if (name.length === 0 || !this.towerMapNames.has(name)) {
			throw `Invalid tower name: ${name}`
		}
		return this.towerMapNames.get(name)!
	}
})()

const Monitor = new (class {
	private BonusGoldHandOfMidas = 160
	private readonly heroes = new Set<Hero>()
	private readonly queueIllusion = new Map<Hero, [Hero, number]>()
	private readonly fakeHeroes = new Map<FakeUnit, [FakeUnit, number]>()

	private readonly uniqueIllusionGoldBuffs = [
		"modifier_darkseer_wallofreplica_illusion",
		"modifier_phantom_lancer_juxtapose_illusion"
	]

	protected get IsTurbo() {
		return (
			GameRules !== undefined &&
			GameRules.GameMode === DOTAGameMode.DOTA_GAMEMODE_TURBO
		)
	}

	public Tick(_dt: number) {
		/** */
	}

	public PostDataUpdate() {
		for (const hero of this.heroes) {
			hero.HeroTeamData?.UpdateTick()
		}
	}

	// WIP
	public ChatEvent(
		typeMessage: DOTA_CHAT_MESSAGE,
		value: number,
		value2: number,
		value3: number,
		...args: number[] // players (PlayerID)
	) {
		switch (typeMessage) {
			default:
			case DOTA_CHAT_MESSAGE.CHAT_MESSAGE_HERO_KILL:
				this.KillHeroMessageChanged(value, value2, value3, ...args)
				break
			case DOTA_CHAT_MESSAGE.CHAT_MESSAGE_ROSHAN_KILL:
				this.KillRoshanMessageChanged(value, value2, value3, ...args)
				break
			case DOTA_CHAT_MESSAGE.CHAT_MESSAGE_COURIER_LOST:
				this.KillCourierMessageChanged(value, value2, value3, ...args)
				break
		}
	}

	public GameEvent(name: string, obj: any) {
		switch (name) {
			case "dota_buyback":
				this.buyBackChanged(obj.entindex)
				break
			case "entity_killed":
				this.lastHitChanged(obj.entindex_killed, obj.entindex_attacker)
				break
			case "entity_hurt":
				this.illusionOrCloneGoldChanged(
					obj.entindex_killed,
					obj.entindex_attacker,
					obj.server_tick
				)
				break
		}
	}

	public EntityChanged(entity: Entity, propertyChanged = false) {
		if (!(entity instanceof Hero)) {
			return
		}

		if (!entity.CanUseAbilities && !entity.CanUseItems) {
			return
		}

		if (propertyChanged) {
			if (!entity.IsRealHero) {
				entity.HeroTeamData = undefined
				this.heroes.delete(entity)
			}
			return
		}

		if (!this.heroes.has(entity)) {
			entity.HeroTeamData = new HeroTeamData(entity)
			this.heroes.add(entity)
		}
	}

	public EntityDestroyed(entity: Entity) {
		if (entity instanceof Hero) {
			entity.HeroTeamData = undefined
			this.heroes.delete(entity)
		}
	}

	public LifeStateChanged(entity: Entity) {
		if (!(entity instanceof Hero) || entity.IsAlive) {
			return
		}

		const data = this.queueIllusion.get(entity)
		if (data === undefined) {
			return
		}

		const [killer, lasTick] = data

		if (
			killer.HeroTeamData === undefined ||
			GameState.CurrentServerTick - lasTick > 1 / 30
		) {
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
			killer.HeroTeamData.UnreliableGold += Math.max(totalAddGold, 300)
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
		// Spirit Lance
		// Doppelganger
		// Wall of Replica
		// Juxtapose (created by Phantom Lancer and from his illusions)
		if (entity.HasAnyBuffByNames(this.uniqueIllusionGoldBuffs)) {
			killer.HeroTeamData.UnreliableGold += 5
			this.queueIllusion.delete(entity)
			return
		}

		const multiplierByLevel = 2
		const goldIllusionByLevel = Math.floor(entity.Level * multiplierByLevel)
		killer.HeroTeamData.UnreliableGold += goldIllusionByLevel
		this.queueIllusion.delete(entity)
	}

	public ParticleCreated(option: NetworkedParticle) {
		switch (option.PathNoEcon) {
			default:
			case "particles/generic_gameplay/rune_bounty_owner.vpcf":
				this.bountyGoldChanged(option)
				break
			case "particles/units/heroes/hero_doom_bringer/doom_bringer_devour.vpcf":
				this.devourGoldChanged(option)
				break
		}
	}

	public ParticleUpdated(option: NetworkedParticle) {
		switch (option.PathNoEcon) {
			default:
			case "particles/items2_fx/hand_of_midas.vpcf":
				this.handOfMidasGoldChanged(option)
				break
			case "particles/units/heroes/hero_bounty_hunter/bounty_hunter_jinada.vpcf":
				this.jinadaGoldChanged(option)
				break
		}
	}

	protected findHero(id: number, byPlayerID = false) {
		for (const hero of this.heroes) {
			if (!byPlayerID ? hero.HandleMatches(id) : hero.PlayerID === id) {
				return hero
			}
		}
		return undefined
	}

	private buyBackChanged(entIndex: number) {
		const hero = this.findHero(entIndex)
		if (hero !== undefined && hero.HeroTeamData !== undefined) {
			hero.HeroTeamData.SetBuyBack()
		}
	}

	private lastHitChanged(indexKilled: number, indexAttacker: number) {
		if (GameRules === undefined) {
			return
		}

		let killer = EntityManager.EntityByIndex(indexAttacker)
		const target = EntityManager.EntityByIndex(indexKilled)
		if (
			!(target instanceof Unit) ||
			!(killer instanceof Unit) ||
			target instanceof AetherRemnant
		) {
			return
		}

		if (target instanceof Building) {
			this.KillBuildingChanged(killer, target)
			return
		}

		if (!killer.IsHero) {
			killer = killer.OwnerEntity
		}

		// e.x: SpiritBear
		if (killer instanceof Player) {
			killer = killer.Hero
		}

		if (!(killer instanceof Hero)) {
			return
		}

		const ownerKiller = killer.ReplicatingOtherHeroModel
		const heroTeamData = !killer.IsRealHero
			? ownerKiller instanceof Hero
				? ownerKiller.HeroTeamData
				: undefined
			: killer.HeroTeamData

		if (heroTeamData === undefined || target.IsHero || target.IsRoshan) {
			return
		}

		//  don't nothing, use dota chat message or any event
		if (target.IsClone || target.IsIllusion || target instanceof Courier) {
			return
		}

		if (!killer.IsEnemy(target)) {
			heroTeamData.DenyCount++
			return
		}

		let averageGold = !this.IsTurbo
			? target.GoldBountyAverage
			: target.GoldBountyAverage * 2

		// https://dota2.fandom.com/wiki/Gold#Wards
		if (target instanceof WardObserver) {
			averageGold += (GameRules.GameTime / 60) * (!this.IsTurbo ? 4 : 8)
		}

		heroTeamData.UnreliableGold += averageGold
		heroTeamData.LastHitCount++
	}

	private illusionOrCloneGoldChanged(
		indexKilled: number,
		indexAttacker: number,
		serverTick: number
	) {
		let killer = EntityManager.EntityByIndex(indexAttacker)
		const target = EntityManager.EntityByIndex(indexKilled)
		if (killer === target || !(target instanceof Hero) || !(killer instanceof Unit)) {
			return
		}

		if (!killer.IsHero) {
			killer = killer.OwnerEntity
		}

		// e.x: SpiritBear
		if (killer instanceof Player) {
			killer = killer.Hero
		}

		if (!(killer instanceof Hero) || !killer.IsEnemy(target)) {
			return
		}

		if (target.IsIllusion || target.IsClone) {
			this.queueIllusion.set(target, [killer, serverTick])
		}
	}

	private bountyGoldChanged(option: NetworkedParticle) {
		if (GameRules === undefined) {
			return
		}

		const owner = option.AttachedTo

		let reliableGold = Runes.CalculateGoldBountyByTime(GameRules.GameTime)
		if (this.IsTurbo) {
			reliableGold *= 2
		}

		if (owner instanceof FakeUnit) {
			if (owner.Name === "npc_dota_hero_alchemist") {
				reliableGold *= this.IsTurbo ? 1 : 2
			}
			this.fakeHeroes.set(owner, [owner, reliableGold])
			return
		}

		if (!(owner instanceof Hero)) {
			return
		}

		const heroTeamData = owner.HeroTeamData
		if (heroTeamData === undefined) {
			return
		}

		if (!this.IsTurbo) {
			const greed = owner.GetAbilityByClass(alchemist_goblins_greed)
			const multiplier = greed?.GetSpecialValue("bounty_multiplier") ?? 1
			reliableGold *= multiplier
		}

		heroTeamData.ReliableGold += reliableGold
	}

	private devourGoldChanged(option: NetworkedParticle) {
		const caster = option.AttachedTo
		if (!(caster instanceof Hero) || caster.HeroTeamData === undefined) {
			return
		}

		const devour = caster.GetAbilityByClass(doom_bringer_devour)
		if (devour !== undefined) {
			caster.HeroTeamData.AddGoldAfterTime(
				devour.GetSpecialValue("bonus_gold"),
				devour.MaxCooldown
			)
		}
	}

	private jinadaGoldChanged(option: NetworkedParticle) {
		const caster = option.ControlPointsEnt.get(0)
		const target = option.ControlPointsEnt.get(1)

		if (
			caster === undefined ||
			target === undefined ||
			!(target[0] instanceof Hero) ||
			!(caster[0] instanceof Hero)
		) {
			return
		}

		if (
			caster[0].HeroTeamData === undefined ||
			target[0].HeroTeamData === undefined
		) {
			return
		}

		const jinada = caster[0].GetAbilityByClass(bounty_hunter_jinada)
		if (jinada === undefined) {
			return
		}

		const casterTeamData = caster[0].HeroTeamData
		const targetTeamData = target[0].HeroTeamData

		const targetGold = targetTeamData.UnreliableGold + targetTeamData.ReliableGold
		const goldSteal = Math.min(targetGold, jinada.GetSpecialValue("gold_steal"))

		casterTeamData.UnreliableGold += goldSteal
		targetTeamData.SubtractGold(goldSteal)
	}

	private handOfMidasGoldChanged(option: NetworkedParticle) {
		if (GameRules === undefined) {
			return
		}

		const caster = option.ControlPointsEnt.get(1)
		if (caster === undefined || caster[0] === undefined) {
			return
		}

		if (caster[0] instanceof FakeUnit) {
			const fakeGold = !this.IsTurbo
				? this.BonusGoldHandOfMidas
				: this.BonusGoldHandOfMidas * 2
			this.fakeHeroes.set(caster[0], [caster[0], fakeGold])
			return
		}

		const midas = caster[0].GetItemByClass(item_hand_of_midas)
		if (midas === undefined) {
			return
		}

		this.BonusGoldHandOfMidas = !this.IsTurbo
			? midas.GetSpecialValue("bonus_gold")
			: midas.GetSpecialValue("bonus_gold") * 2

		if (caster[0].IsClone && caster[0].IsEnemy() && caster[0] instanceof Hero) {
			const mainHero = caster[0].ReplicatingOtherHeroModel
			if (mainHero instanceof Hero && mainHero.HeroTeamData !== undefined) {
				mainHero.HeroTeamData.UnreliableGold += this.BonusGoldHandOfMidas
			}
			return
		}

		let owner: Nullable<Unit> = caster[0]
		if (!(caster[0] instanceof Hero)) {
			owner = caster[0].OwnerEntity as Nullable<Unit>
		}

		if (owner instanceof Player) {
			owner = owner.Hero
		}

		if (owner === undefined || !(owner instanceof Hero)) {
			return
		}

		if (owner.HeroTeamData !== undefined) {
			owner.HeroTeamData.UnreliableGold += this.BonusGoldHandOfMidas
		}
	}

	private KillHeroMessageChanged(
		value: number,
		value2: number,
		value3: number,
		...args: number[]
	) {
		const target = this.findHero(args[0], true)
		const killer = this.findHero(args[1], true)
		if (target === undefined || killer === undefined) {
			return
		}

		// idk, Array.from(this.heroes) faster on 2-3% compared [...this.heroes.keys()]
		const heroes = Array.from(this.heroes).filter(
			x => x !== killer && !x.IsEnemy(killer) && target.Distance2D(x) <= 1500
		)

		const goldBetween = value2 / value3

		for (const hero of heroes) {
			const teamDataBetween = hero.HeroTeamData
			if (teamDataBetween !== undefined) {
				teamDataBetween.UnreliableGold += goldBetween
			}
		}

		const teamDataKiller = killer.HeroTeamData
		if (teamDataKiller !== undefined) {
			teamDataKiller.UnreliableGold += value
		}

		const teamDataTarget = target.HeroTeamData
		if (teamDataTarget !== undefined && !this.IsTurbo) {
			teamDataTarget.UnreliableGold -= teamDataTarget.GoldLossOnDeath
		}
	}

	private KillRoshanMessageChanged(
		value: number,
		value2: number,
		value3: number,
		...args: number[]
	) {
		console.log("KillRoshanMessageChanged", value, value2, value3, args)
	}

	private KillCourierMessageChanged(
		gold: number,
		_value2: number,
		_value3: number,
		...args: number[]
	) {
		const killer = this.findHero(args[0], true)
		if (killer !== undefined) {
			this.addUnreliableGoldTeams(args[1], gold)
		}
	}

	// https://dota2.fandom.com/wiki/Gold#Buildings
	private KillBuildingChanged(killer: Unit, target: Building) {
		if (killer instanceof Hero) {
			const replicate = killer.ReplicatingOtherHeroModel
			const heroTeamData = !killer.IsRealHero
				? replicate instanceof Hero
					? replicate.HeroTeamData
					: undefined
				: killer.HeroTeamData

			if (heroTeamData === undefined) {
				return
			}

			const isDeny = !killer.IsEnemy(target)

			if (target instanceof Barrack) {
				const team = killer.Team
				const isRanged = target.IsRanged
				this.addUnreliableGoldTeams(team, buildingData.GetGoldBarracks(isRanged))

				const bonusGold = buildingData.GetAverageGoldBarrack(isRanged)

				console.log(killer, isDeny, bonusGold)

				heroTeamData.UnreliableGold += bonusGold
				return
			}

			if (target.IsTower) {
				// const goldTower = buildingData.GetGoldTower(target.Name, isDeny)
				// this.addUnreliableGoldTeams(team, goldTower)
				// ((GameRules.GameTime / 60) * 5)
				const goldPerMinute = (GameRules!.GameTime / 60) * 5
				const bonusGold = buildingData.GetAverageGoldTower(target.Name)
				heroTeamData.UnreliableGold += bonusGold
				return
			}

			return
		}

		console.log("KillTowerMessageChanged", killer, target)
	}

	private addUnreliableGoldTeams(gold: number, team: Team) {
		for (const hero of this.heroes) {
			if (hero.Team === team && hero.HeroTeamData !== undefined) {
				hero.HeroTeamData.UnreliableGold += gold
			}
		}
	}

	// https://dota2.fandom.com/wiki/Gold#Lane_creeps
	// we can calculate gold per minute for lane creeps
	// private calculateGoldCreepByTime(
	// 	gameTime: number,
	// 	isSuperCreep: boolean,
	// 	isTurbo = this.IsTurbo
	// ) {
	// 	// Increase in gold per minute based on game mode
	// 	let increasePerMinute = isTurbo ? 3 : 1
	// 	// Adjust increase per minute for super creeps
	// 	if (isSuperCreep) {
	// 		increasePerMinute = isTurbo ? 4.5 : 1.5
	// 	}
	// 	// Calculate the increase in gold per second
	// 	const increasePerSecond = increasePerMinute / (60 * 7.5)
	// 	// Calculate the total bounty gold earned based on game time
	// 	const bountyGold = increasePerSecond * gameTime
	// 	// Round down the bounty gold to the nearest integer
	// 	return Math.floor(bountyGold)
	// }
})()

EventsSDK.on(
	"GameEvent",
	(name, obj) => Monitor.GameEvent(name, obj),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on("EntityCreated", ent => Monitor.EntityChanged(ent), Number.MIN_SAFE_INTEGER)

EventsSDK.on(
	"UnitPropertyChanged",
	unit => Monitor.EntityChanged(unit, true),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"EntityDestroyed",
	ent => Monitor.EntityDestroyed(ent),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"LifeStateChanged",
	ent => Monitor.LifeStateChanged(ent),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"ChatEvent",
	(type, v1, p1, p2, p3, p4, p5, p6, v2, v3) =>
		Monitor.ChatEvent(type, v1, v2, v3, p1, p2, p3, p4, p5, p6),
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

EventsSDK.on("Tick", dt => Monitor.Tick(dt), Number.MIN_SAFE_INTEGER)
EventsSDK.on("PostDataUpdate", () => Monitor.PostDataUpdate(), Number.MIN_SAFE_INTEGER)
