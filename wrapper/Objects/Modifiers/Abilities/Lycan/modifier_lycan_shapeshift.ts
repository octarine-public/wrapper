import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lycan_shapeshift extends Modifier {
	public readonly IsBuff = true

	public SetBonusNightVision(
		specialName = "bonus_night_vision",
		subtract = false
	): void {
		super.SetBonusNightVision(specialName, subtract)
	}
}
