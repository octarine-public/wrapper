import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_naga_siren_rip_tide extends Modifier {
	public readonly IsDebuff = true
	protected SetBonusArmor(specialName = "armor_reduction", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
