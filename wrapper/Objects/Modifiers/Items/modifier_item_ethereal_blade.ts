import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ethereal_blade extends Modifier {
	public readonly IsHidden = true

	protected SetBonusCastRange(
		specialName = "cast_range_bonus",
		subtract = false
	): void {
		super.SetBonusCastRange(specialName, subtract)
	}
}
