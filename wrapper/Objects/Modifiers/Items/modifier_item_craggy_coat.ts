import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_craggy_coat extends Modifier {
	public readonly BonusArmorStack = true
	protected SetBonusArmor(specialName = "armor_bonus", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
