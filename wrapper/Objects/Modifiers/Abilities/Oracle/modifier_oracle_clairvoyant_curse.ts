import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_oracle_clairvoyant_curse extends Modifier {
	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		]
	])

	protected GetSpellAmplifyPercentage(): [number, boolean] {
		const level = this.Parent?.Level ?? 0
		return [level * this.cachedSpellAmplify, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpellAmplify = this.GetSpecialValue(
			"spell_amplification",
			"oracle_clairvoyant_curse"
		)
	}
}
