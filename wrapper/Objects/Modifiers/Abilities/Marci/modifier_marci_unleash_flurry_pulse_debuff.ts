import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_marci_unleash_flurry_pulse_debuff extends Modifier {
	public readonly IsDebuff = true

	protected SetBaseBonusAttackSpeed(
		specialName = "pulse_attack_slow_pct",
		subtract = true
	): void {
		super.SetBaseBonusAttackSpeed(specialName, subtract)
	}
}
