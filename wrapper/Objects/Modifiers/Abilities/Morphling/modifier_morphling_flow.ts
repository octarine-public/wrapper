import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_morphling_flow extends Modifier {
	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		]
	])

	protected GetSpellAmplifyPercentage(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined || this.IsPassiveDisabled()) {
			return [0, false]
		}
		return [owner.TotalAgility / this.cachedSpellAmplify, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpellAmplify = this.GetSpecialValue(
			"agi_per_one_spell_amp",
			"morphling_flow"
		)
	}
}
