import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_broom_handle extends Modifier {
	public readonly BonusArmorStack = true

	protected SetBonusArmor(specialName = "bonus_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
	public SetBonusAttackRange(
		specialName = !this.IsRanged ? "melee_attack_range" : undefined,
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
