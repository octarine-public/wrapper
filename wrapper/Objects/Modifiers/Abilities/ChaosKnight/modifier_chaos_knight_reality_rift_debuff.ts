import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_chaos_knight_reality_rift_debuff extends Modifier {
	public readonly IsDebuff = true

	protected SetBonusArmor(specialName = "armor_reduction", subtract = true) {
		super.SetBonusArmor(specialName, subtract)
	}
}
