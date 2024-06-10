import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_flask_healing extends Modifier {
	public readonly ConsumedAbilityName = "item_flask"
}
