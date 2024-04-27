import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_mask_of_madness_berserk extends Modifier {
	protected SetBonusArmor(
		specialName = "berserk_armor_reduction",
		subtract = true
	): void {
		super.SetBonusArmor(specialName, subtract)
	}

	protected SetBonusMoveSpeed(
		specialName = "berserk_bonus_movement_speed",
		subtract = false
	): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}

	protected SetBonusAttackSpeed(
		specialName = "berserk_bonus_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
