import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ethereal_blade extends Modifier {
	public readonly IsHidden = true

	protected SetBonusCastRange(
		specialName = "bonus_cast_range",
		subtract = false
	): void {
		super.SetBonusCastRange(specialName, subtract)
	}
}
