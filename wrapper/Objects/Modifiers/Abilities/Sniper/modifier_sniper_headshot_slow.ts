import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sniper_headshot_slow extends Modifier {
	public readonly IsDebuff = true

	public SetAttackSpeedAmplifier(specialName = "slow", subtract = false): void {
		super.SetAttackSpeedAmplifier(specialName, subtract)
	}
}
