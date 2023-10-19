import { NetworkedParticle } from "../../Base/NetworkedParticle"
import { Runes } from "../../Data/GameData"
import { DOTA_CHAT_MESSAGE } from "../../Enums/DOTA_CHAT_MESSAGE"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { alchemist_goblins_greed } from "../../Objects/Abilities/Alchemist/alchemist_goblins_greed"
import { AetherRemnant } from "../../Objects/Base/AetherRemnant"
import { Entity, GameRules } from "../../Objects/Base/Entity"
import { FakeUnit } from "../../Objects/Base/FakeUnit"
import { Hero } from "../../Objects/Base/Hero"
import { Player } from "../../Objects/Base/Player"
import { Unit } from "../../Objects/Base/Unit"
import { HeroTeamData } from "../../Objects/DataBook/HeroTeamData"
import { npc_dota_hero_arc_warden } from "../../Objects/Heroes/npc_dota_hero_arc_warden"
import { npc_dota_hero_vengefulspirit } from "../../Objects/Heroes/npc_dota_hero_vengefulspirit"
import { item_hand_of_midas } from "../../Objects/Items/item_hand_of_midas"
import { GameState } from "../../Utils/GameState"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"

/** @ignore */
const Monitor = new (class {
	private BonusGoldHandOfMidas = 160
	private readonly heroes = new Set<Hero>()
	private readonly queueIllusion = new Map<Hero, [Hero, number]>()
	private readonly fakeHeroes = new Map<FakeUnit, [FakeUnit, number]>()

	private readonly uniqueIllusionGoldBuffs = [
		"modifier_darkseer_wallofreplica_illusion",
		"modifier_phantom_lancer_juxtapose_illusion"
	]

	public PostDataUpdate() {
		for (const hero of this.heroes) {
			hero.HeroTeamData?.PostDataUpdate()
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
		if (!this.IsAllowChatMessage(typeMessage)) {
			return
		}

		console.log(typeMessage, value, value2, value3, args)
	}

	public GameEvent(name: string, obj: any) {
		switch (name) {
			case "dota_buyback":
				this.BuyBackChanged(obj.entindex)
				break
			case "entity_killed":
				this.LastHitChanged(obj.entindex_killed, obj.entindex_attacker)
				break
			case "entity_hurt":
				this.IllusionOrCloneGoldChanged(
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
				this.BountyGoldChanged(option)
				break
		}
	}

	public ParticleUpdated(option: NetworkedParticle) {
		switch (option.PathNoEcon) {
			default:
			case "particles/items2_fx/hand_of_midas.vpcf":
				this.HandOfMidasGoldChanged(option)
				break
		}
	}

	protected BuyBackChanged(entIndex: number) {
		const hero = this.FindHeroByIndex(entIndex)
		if (hero !== undefined && hero.HeroTeamData !== undefined) {
			hero.HeroTeamData.SetBuyBack()
		}
	}

	protected LastHitChanged(indexKilled: number, indexAttacker: number) {
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
		if (target.IsClone || target.IsIllusion) {
			return
		}

		if (!killer.IsEnemy(target)) {
			heroTeamData.DenyCount++
			return
		}

		const glodMin = target.GoldBountyMin
		const glodMax = target.GoldBountyMax
		const isEqual = glodMin === glodMax
		const isTurbo = GameRules.GameMode === DOTAGameMode.DOTA_GAMEMODE_TURBO
		const totalGold = Math.floor(isEqual ? glodMax : glodMin + glodMax / 2)

		heroTeamData.UnreliableGold += isTurbo ? totalGold * 2 : totalGold
		heroTeamData.LastHitCount++
	}

	protected IllusionOrCloneGoldChanged(
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

	protected BountyGoldChanged(option: NetworkedParticle) {
		if (GameRules === undefined) {
			return
		}

		const owner = option.AttachedTo
		const isTurbo = GameRules.GameMode === DOTAGameMode.DOTA_GAMEMODE_TURBO

		let reliableGold = Runes.CalculateGoldBountyByTime(GameRules.GameTime)
		if (isTurbo) {
			reliableGold *= 2
		}

		if (owner instanceof FakeUnit) {
			if (owner.Name === "npc_dota_hero_alchemist") {
				reliableGold *= isTurbo ? 1 : 2
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

		if (!isTurbo) {
			const greed = owner.GetAbilityByClass(alchemist_goblins_greed)
			const multiplier = greed?.GetSpecialValue("bounty_multiplier") ?? 1
			reliableGold *= multiplier
		}

		heroTeamData.ReliableGold += reliableGold
	}

	// WIP
	protected DevourGoldChanged(option: NetworkedParticle) {
		if (GameRules === undefined) {
			return
		}

		console.log("DevourGoldChanged", option)
	}

	// WIP
	protected JinadaGoldChanged(option: NetworkedParticle) {
		/** */
	}

	protected HandOfMidasGoldChanged(option: NetworkedParticle) {
		if (GameRules === undefined) {
			return
		}

		const caster = option.ControlPointsEnt.get(1)
		const isTurbo = GameRules.GameMode === DOTAGameMode.DOTA_GAMEMODE_TURBO
		if (caster === undefined || caster[0] === undefined) {
			return
		}

		if (caster[0] instanceof FakeUnit) {
			const fakeGold = !isTurbo
				? this.BonusGoldHandOfMidas
				: this.BonusGoldHandOfMidas * 2
			this.fakeHeroes.set(caster[0], [caster[0], fakeGold])
			return
		}

		const midas = caster[0].GetItemByClass(item_hand_of_midas)
		if (midas === undefined) {
			return
		}

		this.BonusGoldHandOfMidas = !isTurbo
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

	private FindHeroByIndex(index: number) {
		for (const hero of this.heroes) {
			return hero.HandleMatches(index) ? hero : undefined
		}
	}

	// private FindHeroByPlayerID(playerID: number) {
	// 	for (const hero of this.heroes) {
	// 		return hero.PlayerID === playerID ? hero : undefined
	// 	}
	// }

	private IsAllowChatMessage(typeMessage: DOTA_CHAT_MESSAGE) {
		return (
			typeMessage === DOTA_CHAT_MESSAGE.CHAT_MESSAGE_ROSHAN_KILL ||
			typeMessage === DOTA_CHAT_MESSAGE.CHAT_MESSAGE_HERO_KILL
		)
	}
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

EventsSDK.on("PostDataUpdate", () => Monitor.PostDataUpdate(), Number.MIN_SAFE_INTEGER)
