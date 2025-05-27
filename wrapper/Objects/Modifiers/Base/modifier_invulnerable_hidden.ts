import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invulnerable_hidden extends Modifier {
	public readonly IsHidden = false
}
