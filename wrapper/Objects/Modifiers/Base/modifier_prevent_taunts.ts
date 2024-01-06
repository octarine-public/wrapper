import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_prevent_taunts extends Modifier {
	public readonly IsHidden = true
}
