import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_cloak_of_flames extends Modifier {
	public readonly BonusArmorStack = true
	protected SetBonusArmor(specialName = "armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
