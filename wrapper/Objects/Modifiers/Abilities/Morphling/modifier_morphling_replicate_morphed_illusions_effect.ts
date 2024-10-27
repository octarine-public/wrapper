import { WrapperClassModifier } from "../../../../Decorators"
import { EventsSDK } from "../../../../Managers/EventsSDK"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_morphling_replicate_morphed_illusions_effect extends Modifier {
	public UnitPropertyChanged(): boolean {
		if (!super.UnitPropertyChanged()) {
			return false
		}
		const owner = this.Parent
		if (owner === undefined) {
			return false
		}
		owner.IsIllusion_ = true
		EventsSDK.emit("UnitPropertyChanged", false, owner)
		return true
	}
}
