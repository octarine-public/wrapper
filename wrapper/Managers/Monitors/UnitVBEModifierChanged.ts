import { DOTA_ABILITY_BEHAVIOR } from "../../Enums/DOTA_ABILITY_BEHAVIOR"
import { EventPriority } from "../../Enums/EventPriority"
import { GameSleeper } from "../../Helpers/Sleeper"
import { Item } from "../../Objects/Base/Item"
import { Modifier } from "../../Objects/Base/Modifier"
import { Unit } from "../../Objects/Base/Unit"
import { GameState } from "../../Utils/GameState"
import { readJSON } from "../../Utils/Utils"
import { EventsSDK } from "../EventsSDK"

interface IModifiersIgnore {
	vbeModifiers: string[]
}
new (class CUnitVBEModifierChanged {
	private readonly maxDuration = 2
	private readonly eventSleeper = new GameSleeper()
	private readonly ignoreData = readJSON<IModifiersIgnore>("ignore_data.json")

	constructor() {
		EventsSDK.on("GameEnded", this.GameEnded.bind(this), EventPriority.IMMEDIATE)
		EventsSDK.on(
			"UnitItemsChanged",
			this.UnitItemsChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"ModifierChangedVBE",
			this.ModifierChangedVBE.bind(this),
			EventPriority.IMMEDIATE
		)
	}
	protected ModifierChangedVBE(mod: Modifier) {
		const parent = mod.Parent
		if (parent === undefined || mod.IsAura || parent.IsEnemy()) {
			return
		}
		if (this.eventSleeper.Sleeping(parent.Index)) {
			return
		}
		const ability = mod.Ability
		if (!(ability instanceof Item)) {
			return
		}
		if (
			ability.IsNeutralActiveDrop &&
			ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE)
		) {
			return
		}
		if (parent.HasAnyBuffByNames(this.ignoreData.vbeModifiers)) {
			return
		}
		const item = parent.TotalItems.find(x => x === ability)
		if (
			item === undefined ||
			this.skipItemByTime(item.CreateTime) ||
			this.skipItemByTime(item.PurchaseTime)
		) {
			return
		}
		parent.IsVisibleForEnemiesLastTime = GameState.RawGameTime
		EventsSDK.emit("UnitVBEModifierChanged", false, parent)
	}
	protected UnitItemsChanged(unit: Unit) {
		if (!unit.IsEnemy()) {
			this.eventSleeper.Sleep(this.maxDuration * 1000, unit.Index)
		}
	}
	protected GameEnded() {
		this.eventSleeper.FullReset()
	}
	private skipItemByTime(time: number) {
		return time + this.maxDuration > GameState.RawGameTime
	}
})()
