import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_beastmaster_primal_roar_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetBonusAttackSpeed(
		specialName = "slow_attack_speed_pct",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected SetMoveSpeedAmplifier(
		specialName = "slow_movement_speed_pct",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
