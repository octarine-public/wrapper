import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_luna_lunar_blessing extends Modifier {
	public SetBonusNightVision(
		specialName = "bonus_night_vision",
		subtract = false
	): void {
		super.SetBonusNightVision(specialName, subtract)
	}
}
