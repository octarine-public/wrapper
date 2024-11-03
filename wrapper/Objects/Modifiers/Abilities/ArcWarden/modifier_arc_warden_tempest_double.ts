import { WrapperClassModifier } from "../../../../Decorators"
import { EventsSDK } from "../../../../Managers/EventsSDK"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_arc_warden_tempest_double extends Modifier {
	protected UnitPropertyChanged(changed?: boolean): boolean {
		const owner = this.Parent
		const state = (changed ??= true)
		if (owner === undefined) {
			return false
		}
		owner.IsClone_ = state
		owner.IsStrongIllusion_ = state
		EventsSDK.emit("UnitPropertyChanged", false, owner)
		return super.UnitPropertyChanged(changed)
	}
}
