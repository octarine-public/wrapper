import { EventPriority } from "../../Enums/EventPriority"
import { Item } from "../../Objects/Base/Item"
import { Modifier } from "../../Objects/Base/Modifier"
import { GameState } from "../../Utils/GameState"
import { readJSON } from "../../Utils/Utils"
import { EventsSDK } from "../EventsSDK"

interface IModifiersIgnore {
	vbeModifiers: string[]
}
new (class CUnitVBEModifierChanged {
	private readonly ignoreModifiers = new Set(
		readJSON<IModifiersIgnore>("ignore_data.json").vbeModifiers
	)

	constructor() {
		EventsSDK.on(
			"ModifierChangedVBE",
			this.ModifierChangedVBE.bind(this),
			EventPriority.IMMEDIATE
		)
	}
	protected ModifierChangedVBE(mod: Modifier) {
		if (this.ignoreModifiers.has(mod.Name)) {
			return
		}
		const parent = mod.Parent
		if (parent === undefined || mod.IsAura || parent.IsEnemy()) {
			return
		}
		if (
			mod.Ability instanceof Item &&
			(mod.Ability.IsNeutralActiveDrop || mod.Ability.IsNeutralPassiveDrop)
		) {
			return
		}
		if (mod.RemainingTime !== 0) {
			return
		}
		const time = GameState.RawGameTime
		if (time - mod.CreationTime <= GameState.TickInterval * 3) {
			return
		}
		parent.IsVisibleForEnemiesLastTime = time
		EventsSDK.emit("UnitVBEModifierChanged", false, parent)
	}
})()
