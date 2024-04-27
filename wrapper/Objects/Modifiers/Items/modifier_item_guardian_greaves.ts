import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_guardian_greaves extends Modifier {
	public readonly IsBoots = true
	public readonly BonusArmorStack = true

	protected SetBonusMoveSpeed(specialName = "bonus_movement", subtract = false): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}

	protected SetBonusArmor(specialName = "bonus_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
