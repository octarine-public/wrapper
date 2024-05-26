import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_monkey_king_fur_army_bonus_damage extends Modifier {
	protected SetBonusArmor(specialName = "bonus_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
