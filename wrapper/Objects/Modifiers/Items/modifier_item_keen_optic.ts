import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_keen_optic extends Modifier {
	public readonly IsHidden = true

	protected SetBonusCastRange(
		specialName = "cast_range_bonus",
		subtract = false
	): void {
		super.SetBonusCastRange(specialName, subtract)
	}
}
