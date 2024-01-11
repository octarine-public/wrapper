import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_pavise_shield extends Modifier {
	public readonly IsShield = true
}
