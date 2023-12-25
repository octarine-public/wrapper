import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_glimmer_cape extends Modifier {
	protected SetBonusMoveSpeed(specialName = "active_movement_speed"): void {
		if (this.Parent === undefined) {
			return
		}
		this.BonusMoveSpeed = this.Parent.IsInvisible
			? this.GetSpecialValue(specialName)
			: 0
	}
}
