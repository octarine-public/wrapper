import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_life_stealer_rage extends Modifier {
	public readonly IsBuff = true

	protected SetMoveSpeedAmplifier(
		specialName = "movement_speed_bonus",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
