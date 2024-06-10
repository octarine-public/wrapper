import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_clarity_potion extends Modifier {
	public readonly ConsumedAbilityName = "item_clarity"
}
