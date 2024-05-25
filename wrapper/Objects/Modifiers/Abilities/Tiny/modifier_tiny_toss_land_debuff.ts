import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tiny_toss_land_debuff extends Modifier {
	protected SetBonusAttackSpeed(
		specialName = "land_attack_slow",
		subtract = true
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
