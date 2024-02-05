import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_zuus_static_field_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetBonusAttackSpeed(specialName = "aspd_slow", subtract = true): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected SetMoveSpeedAmplifier(specialName = "move_slow", subtract = true): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
