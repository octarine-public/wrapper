import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_mind_breaker extends Modifier {
	protected SetBonusAttackSpeed(specialName = "attack_speed", subtract = false): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
