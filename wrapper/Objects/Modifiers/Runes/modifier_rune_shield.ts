import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_shield extends Modifier {
	public readonly IsShield = true
}
