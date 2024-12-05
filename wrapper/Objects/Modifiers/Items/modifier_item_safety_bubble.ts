import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_safety_bubble extends Modifier {
	public readonly HasVisualShield = true
}
