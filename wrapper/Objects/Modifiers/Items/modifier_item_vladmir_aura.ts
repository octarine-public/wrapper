import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_vladmir_aura extends Modifier {
	protected SetBonusArmor(specialName = "armor_aura", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
