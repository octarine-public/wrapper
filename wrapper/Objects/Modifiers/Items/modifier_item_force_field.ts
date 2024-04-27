import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_force_field extends Modifier {
	public readonly BonusArmorStack = true
	protected SetBonusArmor(specialName = "self_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
