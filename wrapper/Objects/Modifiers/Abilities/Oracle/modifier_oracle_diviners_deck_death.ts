import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_oracle_diviners_deck_death extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSpellAmp = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return [this.cachedSpellAmp, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "oracle_diviners_deck"
		this.cachedSpellAmp = this.GetSpecialValue("spell_amplification", name)
	}
}
