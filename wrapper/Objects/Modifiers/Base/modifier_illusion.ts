import { WrapperClassModifier } from "../../../Decorators"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_illusion extends Modifier {
	public readonly IsHidden = true

	public UnitPropertyChanged(changed?: boolean): boolean {
		const owner = this.Parent
		const state = (changed ??= true)
		if (owner === undefined || !owner.IsSpiritBear) {
			return super.UnitPropertyChanged(changed)
		}
		owner.IsIllusion_ = state
		EventsSDK.emit("UnitPropertyChanged", false, owner)
		return super.UnitPropertyChanged(changed)
	}
}
