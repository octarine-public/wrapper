import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_buckler_effect extends Modifier {
	protected SetBonusArmor(specialName = "bonus_aoe_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
