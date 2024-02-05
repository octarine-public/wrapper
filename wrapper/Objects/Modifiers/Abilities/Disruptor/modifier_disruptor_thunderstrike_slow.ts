import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_disruptor_thunderstrike_slow extends Modifier {
	public readonly IsDebuff = true

	public SetAttackSpeedAmplifier(specialName = "slow_amount", subtract = true): void {
		super.SetAttackSpeedAmplifier(specialName, subtract)
	}

	public SetMoveSpeedAmplifier(specialName = "slow_amount", subtract = true): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
