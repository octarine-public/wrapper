import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_mage_slayer_debuff extends Modifier {
	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		]
	])

	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return [-this.cachedSpellAmplify, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		this.cachedSpellAmplify = this.GetSpecialValue(
			"spell_amp_debuff",
			"item_mage_slayer"
		)
	}
}
