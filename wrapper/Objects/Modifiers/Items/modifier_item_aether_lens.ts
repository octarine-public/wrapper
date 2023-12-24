import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_aether_lens extends Modifier {
	protected GetSpecialValue(
		specialName = "cast_range_bonus",
		level = this.AbilityLevel
	): number {
		return super.GetSpecialValue(specialName, level)
	}
}
