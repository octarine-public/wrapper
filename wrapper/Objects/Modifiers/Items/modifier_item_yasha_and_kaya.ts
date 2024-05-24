import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_yasha_and_kaya extends Modifier {
	public readonly BonusAttackSpeedStack = true

	public SetBonusCastPointAmplifier(
		specialName = "cast_speed_pct",
		subtract = false
	): void {
		super.SetBonusCastPointAmplifier(specialName, subtract)
	}

	protected SetMoveSpeedAmplifier(
		specialName = "movement_speed_percent_bonus",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	protected SetBonusAttackSpeed(
		specialName = "bonus_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
