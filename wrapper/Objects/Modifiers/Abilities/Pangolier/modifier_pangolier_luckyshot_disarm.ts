import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_pangolier_luckyshot_disarm extends Modifier {
	public readonly IsDebuff = true

	public SetBonusAttackSpeed(specialName = "attack_slow", subtract = true): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
