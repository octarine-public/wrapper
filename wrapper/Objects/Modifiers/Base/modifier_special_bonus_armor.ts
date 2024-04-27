import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_armor extends Modifier {
	public readonly IsHidden = true

	protected SetBonusArmor(specialName = "value", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
