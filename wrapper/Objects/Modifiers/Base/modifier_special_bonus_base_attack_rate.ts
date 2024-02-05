import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_base_attack_rate extends Modifier {
	public readonly IsHidden = true

	protected SetBonusMoveSpeed(specialName = "value", subtract = false): void {
		super.SetFixedBaseAttackTime(specialName, subtract)
	}
}
