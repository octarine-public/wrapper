import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dragon_knight_dragon_blood extends Modifier {
	public readonly IsBuff = true
	protected SetBonusArmor(specialName = "bonus_armor", subtract = false) {
		super.SetBonusArmor(specialName, subtract)
	}
}
