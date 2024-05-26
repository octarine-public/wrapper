import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rubick_arcane_supremacy extends Modifier {
	public readonly IsHidden = true

	protected SetBonusAOERadius(specialName = "aoe_bonus", subtract = false): void {
		super.SetBonusAOERadius(specialName, subtract)
	}

	protected SetBonusCastRange(specialName = "cast_range", subtract = false): void {
		super.SetBonusCastRange(specialName, subtract)
	}
}
