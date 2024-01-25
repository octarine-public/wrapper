import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tiny_tree_grab extends Modifier {
	protected SetBonusAttackRange(specialName = "splash_width", subtract = false): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
