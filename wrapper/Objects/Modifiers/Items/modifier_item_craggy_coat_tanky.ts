import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_craggy_coat_tanky extends Modifier {
	protected SetBonusMoveSpeed(specialName = "move_speed") {
		if (this.Parent === undefined) {
			return
		}
		this.BonusMoveSpeed = !this.Parent.IsUnslowable
			? -this.GetSpecialValue(specialName)
			: 0
	}
}
