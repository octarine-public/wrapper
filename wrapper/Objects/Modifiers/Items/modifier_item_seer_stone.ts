import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_seer_stone extends Modifier {
	public readonly IsHidden = true

	protected SetBonusCastRange(
		specialName = "cast_range_bonus",
		subtract = false
	): void {
		super.SetBonusCastRange(specialName, subtract)
	}

	protected SetBonusDayVision(specialName = "vision_bonus", subtract = false): void {
		super.SetBonusDayVision(specialName, subtract)
	}

	protected SetBonusNightVision(specialName = "vision_bonus", subtract = false): void {
		super.SetBonusNightVision(specialName, subtract)
	}
}
