import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_vengefulspirit_wave_of_terror extends Modifier {
	public readonly IsDebuff = true
	protected SetBonusArmor(specialName = "armor_reduction", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
