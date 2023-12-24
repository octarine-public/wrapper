import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ethereal_blade extends Modifier {
	protected GetSpecialValue(
		specialName = "bonus_cast_range",
		level = this.AbilityLevel
	): number {
		return super.GetSpecialValue(specialName, level)
	}
}
