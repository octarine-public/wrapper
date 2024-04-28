import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_plate_mail extends Modifier {
	public readonly BonusArmorStack = true
	protected SetBonusArmor(specialName = "bonus_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}