import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_sai extends Modifier {
	protected SetFixedBaseAttackTime(
		specialName = "sai_base_attack_time",
		subtract = false
	): void {
		super.SetFixedBaseAttackTime(specialName, subtract)
	}
}
