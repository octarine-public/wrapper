import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slardar_sprint extends Modifier {
	public readonly IsBuff = true

	public SetMoveSpeedAmplifier(specialName = "bonus_speed", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
