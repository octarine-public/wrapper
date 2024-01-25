import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_troll_warlord_berserkers_rage extends Modifier {
	protected SetBonusAttackRange(specialName = "bonus_range", subtract = true): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
