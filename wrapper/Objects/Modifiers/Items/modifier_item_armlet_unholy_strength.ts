import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_armlet_unholy_strength extends Modifier {
	protected SetBonusArmor(specialName = "unholy_bonus_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
