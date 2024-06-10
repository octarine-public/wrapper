import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_teleporting extends Modifier {
	public readonly ConsumedAbilityName = "item_tpscroll"
}
