import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_marci_unleash_flurry_cooldown extends Modifier {
	protected SetFixedBaseAttackTime(
		specialName = "recovery_fixed_attack_rate",
		subtract = false
	): void {
		super.SetFixedBaseAttackTime(specialName, subtract)
	}
}
