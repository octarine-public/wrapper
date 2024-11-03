import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_wraith_band extends Modifier {
	public readonly BonusArmorStack = true
	public readonly BonusAttackSpeedStack = true

	protected SetBonusArmor(specialName = "bonus_armor", subtract = false) {
		super.SetBonusArmor(specialName, subtract)
	}

	protected SetBonusAttackSpeed(specialName = "bonus_attack_speed", subtract = false) {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
