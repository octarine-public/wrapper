import { WrapperClassModifier } from "../../../../Decorators"
import { EventsSDK } from "../../../../Managers/EventsSDK"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_vengefulspirit_hybrid_special extends Modifier {
	public UnitPropertyChanged(changed?: boolean): boolean {
		const owner = this.Parent
		const state = (changed ??= true)
		if (owner === undefined) {
			return false
		}
		owner.IsReflection_ = true
		owner.IsStrongIllusion_ = state && owner.IsAlive
		EventsSDK.emit("UnitPropertyChanged", false, owner)
		return super.UnitPropertyChanged(changed)
	}
}
