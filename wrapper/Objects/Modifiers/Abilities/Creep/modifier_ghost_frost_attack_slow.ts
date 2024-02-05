import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ghost_frost_attack_slow extends Modifier {
	public readonly IsDebuff = true

	public SetBonusAttackSpeed(specialName = "attackspeed_slow", subtract = false): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	public SetMoveSpeedAmplifier(specialName = "movespeed_slow", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
