import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_seer_stone extends Modifier {
	protected SetBonusDayVision(specialName = "vision_bonus", subtract = false): void {
		super.SetBonusDayVision(specialName, subtract)
	}

	protected SetBonusNightVision(specialName = "vision_bonus", subtract = false): void {
		super.SetBonusNightVision(specialName, subtract)
	}
}
