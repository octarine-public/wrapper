import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_marci_bodyguarded extends Modifier {
	public SetBonusArmor(specialName = "bonus_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
