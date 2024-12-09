import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ghost_state extends Modifier {
	public readonly IsGhost = true
}
