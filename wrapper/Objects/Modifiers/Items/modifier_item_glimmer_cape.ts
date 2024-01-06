import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_glimmer_cape extends Modifier {
	public readonly IsBuff = true
	public readonly IsShield = true
}
