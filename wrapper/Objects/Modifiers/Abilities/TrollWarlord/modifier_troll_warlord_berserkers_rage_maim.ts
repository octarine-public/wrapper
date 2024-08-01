import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_troll_warlord_berserkers_rage_maim extends Modifier {
	public SetBonusAttackSpeed(specialName = "maim_attack_slow", subtract = true): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
