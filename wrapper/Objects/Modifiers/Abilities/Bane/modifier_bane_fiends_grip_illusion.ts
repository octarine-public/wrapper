import { WrapperClassModifier } from "../../../../Decorators"
import { EventsSDK } from "../../../../Managers/EventsSDK"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bane_fiends_grip_illusion extends Modifier {
	public UnitPropertyChanged(changed?: boolean): boolean {
		const owner = this.Parent
		const state = (changed ??= true)
		if (owner === undefined) {
			return super.UnitPropertyChanged(changed)
		}
		owner.ModifierManager.IsReflection_ = state
		EventsSDK.emit("UnitPropertyChanged", false, owner)
		return super.UnitPropertyChanged(changed)
	}
}
