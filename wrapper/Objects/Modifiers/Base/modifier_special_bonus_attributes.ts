import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_attributes extends Modifier {
	public readonly IsHidden = true
}
