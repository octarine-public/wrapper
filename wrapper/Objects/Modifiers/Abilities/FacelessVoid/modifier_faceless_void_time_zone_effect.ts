import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_faceless_void_time_zone_effect extends Modifier {
	protected SetBonusAttackSpeed(
		specialName = "bonus_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(
			specialName,
			this.Caster?.IsEnemy() ? subtract : !subtract
		)
	}

	protected SetTurnRateAmplifier(
		specialName = "bonus_turn_speed",
		subtract = false
	): void {
		super.SetTurnRateAmplifier(
			specialName,
			this.Caster?.IsEnemy() ? subtract : !subtract
		)
	}

	protected SetBonusCastPointAmplifier(
		specialName = "bonus_cast_speed",
		subtract = false
	): void {
		super.SetBonusCastPointAmplifier(
			specialName,
			this.Caster?.IsEnemy() ? subtract : !subtract
		)
	}
}
