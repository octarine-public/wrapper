import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_muerta_the_calling_aura_slow extends Modifier {
	public readonly IsDebuff = true

	public SetBonusAttackSpeed(
		specialName = "aura_attackspeed_slow",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	public SetMoveSpeedAmplifier(
		specialName = "aura_movespeed_slow",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
