import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tidehunter_gush extends Modifier {
	public readonly IsDebuff = true

	public SetMoveSpeedAmplifier(specialName = "movement_speed", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
