import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_boots_of_bearing_active extends Modifier {
	protected SetMoveSpeedAmplifier(
		specialName = "bonus_movement_speed_pct",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	protected SetBonusAttackSpeed(
		specialName = "bonus_attack_speed_pct",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
