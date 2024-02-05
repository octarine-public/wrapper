import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_furbolg_enrage_attack_speed extends Modifier {
	public readonly IsBuff = true

	public SetBonusAttackSpeed(specialName = "bonus_aspd", subtract = false): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
