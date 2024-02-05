import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mirana_leap_buff extends Modifier {
	public readonly IsBuff = true

	protected SetBonusAttackSpeed(
		specialName = "leap_speedbonus_as",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
