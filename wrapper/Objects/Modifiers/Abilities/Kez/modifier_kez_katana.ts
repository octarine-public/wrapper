import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_katana extends Modifier {
	protected SetFixedBaseAttackTime(
		specialName = "katana_base_attack_time",
		subtract = false
	): void {
		super.SetFixedBaseAttackTime(specialName, subtract)
	}
}
