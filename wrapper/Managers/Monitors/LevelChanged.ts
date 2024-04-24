/* eslint-disable @typescript-eslint/naming-convention */
import { EventPriority } from "../../Enums/EventPriority"
import { Ability } from "../../Objects/Base/Ability"
import { FakeUnits } from "../../Objects/Base/FakeUnit"
import { PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { EventsSDK } from "../EventsSDK"

interface IHeroLevelUp {
	readonly level: number
	readonly player: number
	readonly player_id: number
	readonly PlayerID: number
	readonly server_tick: number
	readonly hero_entindex: number
}

interface IAbilityLevelUp {
	PlayerID: number
	player: number /** entindex */
	abilityname: string
	server_tick: number
}

const Monitor = new (class CLevelChanged {
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
				this.UnitLevelChanged(
					unitObj.PlayerID,
					unitObj.hero_entindex,
					unitObj.level
				)
				break
			case "dota_player_learned_ability":
				const abilObj = obj as IAbilityLevelUp
				this.UnitAbilityLevelChanged(abilObj.PlayerID, abilObj.abilityname)
				break
		}
	}

	protected UnitLevelChanged(playerID: number, heroEntIndex: number, newLevel: number) {
		const fakeUnit = FakeUnits.find(x => x.HandleMatches(heroEntIndex))
		if (fakeUnit !== undefined && fakeUnit.Level !== newLevel) {
			fakeUnit.Level = newLevel
		}
		const playerData = PlayerCustomData.get(playerID)
		if (playerData === undefined || playerData.Hero === undefined) {
			return
		}
		if (playerData.Hero.Level !== newLevel && !playerData.Hero.IsVisible) {
			playerData.Hero.Level = newLevel
		}
	}

	protected UnitAbilityLevelChanged(playerID: number, abilityName: string) {
		if (!abilityName.length) {
			return
		}
		const playerData = PlayerCustomData.get(playerID)
		if (
			playerData === undefined ||
			playerData.Hero === undefined ||
			playerData.Hero.IsVisible
		) {
			return
		}
		const ability = playerData.Hero.GetAbilityByName(abilityName)
		if (ability === undefined) {
			return
		}
		const getSpecialLinked = this.linkedSpecial.get(ability.Name)
		if (getSpecialLinked !== undefined) {
			ability.Level++
			EventsSDK.emit("AbilityLevelChanged", false, ability)
			this.ChangeComboLevel(ability, getSpecialLinked)
			return
		}
		const getlinkedAbilityName = ability.AbilityData.LinkedAbility
		if (getlinkedAbilityName.length !== 0) {
			this.ChangeComboLevel(ability, getlinkedAbilityName)
			return
		}
		ability.Level++
		EventsSDK.emit("AbilityLevelChanged", false, ability)
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
		EventsSDK.emit("AbilityLevelChanged", false, linked)
		this.linkedNames.add(linkedName)
		this.ChangeComboLevel(linked, linked.AbilityData.LinkedAbility)
		this.linkedNames.delete(linkedName)
	}
})()

EventsSDK.on("GameEnded", () => Monitor.GameEnded(), EventPriority.IMMEDIATE)

EventsSDK.on(
	"GameEvent",
	(name, obj) => Monitor.GameEvent(name, obj),
	EventPriority.IMMEDIATE
)
