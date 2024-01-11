import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bloodseeker_thirst_vision extends Modifier {
	public readonly IsVisibleForEnemies = true
}
