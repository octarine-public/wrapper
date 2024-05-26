import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_wex_instance extends Modifier {
	protected SetBonusAttackSpeed(
		specialName = "intrinsic_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
