import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_witch_blade extends Modifier {
	public readonly BonusAttackSpeedStack = true

	protected SetBonusAttackSpeed(specialName = "bonus_attack_speed", subtract = false) {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}