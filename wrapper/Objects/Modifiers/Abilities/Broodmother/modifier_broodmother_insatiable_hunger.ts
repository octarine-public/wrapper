import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_broodmother_insatiable_hunger extends Modifier {
	protected SetBonusBaseAttackTime(specialName = "bat_bonus", subtract = true): void {
		super.SetBonusBaseAttackTime(specialName, subtract)
	}
}
