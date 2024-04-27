import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_desolator_2_buff extends Modifier {
	// IsDebuff = false because it's neutral tier has SpellImmunityType
	// SPELL_IMMUNITY_ENEMIES_YES

	protected SetBonusArmor(specialName = "corruption_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
