import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_storm_spirit_overload_debuff extends Modifier {
	public readonly IsDebuff = true

	protected SetBonusAttackSpeed(
		specialName = "overload_attack_slow",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected SetMoveSpeedAmplifier(
		specialName = "overload_move_slow",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
