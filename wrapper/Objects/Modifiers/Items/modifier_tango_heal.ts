import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tango_heal extends Modifier {
	public readonly ConsumedAbilityName = "item_tango"
}
