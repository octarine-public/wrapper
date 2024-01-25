import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_earthshaker_enchant_totem extends Modifier {
	public readonly IsBuff = true

	protected SetBonusAttackRange(
		specialName = "bonus_attack_range",
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
