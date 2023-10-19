/* eslint-disable @typescript-eslint/naming-convention */
import { Ability } from "../../Imports"
import { Hero } from "../../Objects/Base/Hero"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"

/** @ignore */
interface IHeroLevelUp {
	readonly level: number
	readonly player: number
	readonly player_id: number
	readonly PlayerID: number
	readonly server_tick: number
	readonly hero_entindex: number
}

/** @ignore */
interface IAbilityLevelUp {
	PlayerID: number
	player: number
	abilityname: string
	server_tick: number
}

/** @ignore */
const heroes = EntityManager.GetEntitiesByClass(Hero)

/** @ignore */
const Monitor = new (class {
	/** temp for ChangeComboLevel */
	private readonly linkedNames = new Set<string>()
	private readonly linkedSpecial = new Map([
		["monkey_king_tree_dance", "monkey_king_primal_spring"]
	])

	public GameEnded() {
		this.linkedNames.clear()
	}

	public GameEvent(name: string, obj: any) {
		switch (name) {
			case "dota_player_gained_level":
				const unitObj = obj as IHeroLevelUp
				this.UnitLevelChanged(unitObj.hero_entindex, unitObj.level)
				break
			case "dota_player_learned_ability":
				const abilObj = obj as IAbilityLevelUp
				this.UnitAbilityLevelChanged(abilObj.PlayerID, abilObj.abilityname)
				break
		}
	}

	protected UnitLevelChanged(heroEntIndex: number, newLevel: number) {
		const unit = heroes.find(x => x.HandleMatches(heroEntIndex) && x.IsEnemy())
		if (unit !== undefined && unit.Level !== newLevel && !unit.IsVisible) {
			unit.Level = newLevel
		}
	}

	protected UnitAbilityLevelChanged(playerID: number, abilityName: string) {
		if (!abilityName.length) {
			return
		}
		const hero = heroes.find(x => x.PlayerID === playerID && x.IsEnemy())
		if (hero === undefined || hero.IsVisible) {
			return
		}
		const ability = hero.GetAbilityByName(abilityName)
		if (ability === undefined) {
			return
		}
		const getSpecialLinked = this.linkedSpecial.get(ability.Name)
		if (getSpecialLinked !== undefined) {
			ability.Level++
			this.ChangeComboLevel(ability, getSpecialLinked)
			return
		}
		const getlinkedAbilityName = ability.AbilityData.LinkedAbility
		if (getlinkedAbilityName.length !== 0) {
			this.ChangeComboLevel(ability, getlinkedAbilityName)
			return
		}
		ability.Level++
	}

	protected ChangeComboLevel(abil: Ability, linkedName: string) {
		const owner = abil.Owner
		if (owner === undefined || this.linkedNames.has(linkedName)) {
			return
		}
		const linked = owner.GetAbilityByName(linkedName)
		if (linked === undefined) {
			return
		}
		linked.Level++
		this.linkedNames.add(linkedName)
		this.ChangeComboLevel(linked, linked.AbilityData.LinkedAbility)
		this.linkedNames.delete(linkedName)
	}
})()

EventsSDK.on(
	"GameEvent",
	(name, obj) => Monitor.GameEvent(name, obj),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on("GameEnded", () => Monitor.GameEnded(), Number.MIN_SAFE_INTEGER)
