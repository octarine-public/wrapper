import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_vengefulspirit_soul_strike extends Modifier {
	protected SetFixedBaseAttackTime(
		specialName = "bat_tooltip",
		subtract = false
	): void {
		super.SetFixedBaseAttackTime(specialName, subtract)
	}
}
