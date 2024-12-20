import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lina_flame_cloak extends Modifier {
	private cachedMres = 0
	private cachedVisualZDelta = 0
	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])

	public get DeltaZ(): number {
		return this.cachedVisualZDelta
	}

	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return [this.cachedSpellAmplify, false]
	}

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "lina_flame_cloak"
		this.cachedMres = this.GetSpecialValue("magic_resistance", name)
		this.cachedSpellAmplify = this.GetSpecialValue("spell_amp", name)
		this.cachedVisualZDelta = this.GetSpecialValue("visualzdelta", name)
	}
}
