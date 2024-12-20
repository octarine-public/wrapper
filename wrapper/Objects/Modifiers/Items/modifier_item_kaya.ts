import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_kaya extends Modifier {
	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_UNIQUE,
			this.GetSpellAmplifyPercentageUnique.bind(this)
		]
	])

	protected GetSpellAmplifyPercentageUnique(): [number, boolean] {
		return [this.cachedSpellAmplify, false]
	}

	protected UpdateSpecialValues() {
		this.cachedSpellAmplify = this.GetSpecialValue("spell_amp", "item_kaya")
	}
}
