import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_visage_grave_chill_debuff extends Modifier {
	public readonly IsDebuff = true

	public SetBonusAttackSpeed(specialName = "attackspeed_bonus", subtract = true): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	public SetMoveSpeedAmplifier(specialName = "movespeed_bonus", subtract = true): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
