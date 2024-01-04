import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ancient_janggo extends Modifier {
	public readonly IsBuff = true
}
