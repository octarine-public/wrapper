import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_divine_rapier extends Modifier {
	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		]
	])

	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return (this.Ability?.IsToggled ?? false)
			? [this.cachedSpellAmplify, false]
			: [0, false]
	}

	protected UpdateSpecialValues() {
		this.cachedSpellAmplify = this.GetSpecialValue("bonus_spell_amp", "item_rapier")
	}
}
