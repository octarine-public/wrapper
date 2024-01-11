import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_pipe_barrier extends Modifier {
	public readonly IsShield = true
}
