import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_muerta_supernatural extends Modifier {
	private cachedSpellAmplify = 0
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		]
	])
	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return [this.cachedSpellAmplify * this.StackCount, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedSpellAmplify = this.GetSpecialValue(
			"spell_amp_per_stack",
			"muerta_supernatural"
		)
	}
}
