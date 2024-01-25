import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_attack_range extends Modifier {
	public readonly IsHidden = true

	protected SetBonusAttackRange(specialName = "value", subtract = false): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
