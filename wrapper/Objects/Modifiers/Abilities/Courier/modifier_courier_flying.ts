import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_courier_flying extends Modifier {
	public readonly ShouldDoFlyHeightVisual = true
}
