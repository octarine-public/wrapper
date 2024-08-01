import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lycan_summon_wolves_crit_maim extends Modifier {
	public readonly IsDebuff = true

	public SetBonusAttackSpeed(specialName = "maim_attack_speed", subtract = true): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
