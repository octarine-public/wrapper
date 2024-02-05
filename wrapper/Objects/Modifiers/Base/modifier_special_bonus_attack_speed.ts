import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_attack_speed extends Modifier {
	public readonly IsHidden = true

	protected SetBonusAttackSpeed(specialName = "value", subtract = false): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
