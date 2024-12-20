import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_kaya_and_sange extends Modifier {
	private cachedSpeedResist = 0
	private cachedSpellAmplify = 0
	private cachedManaCostReduction = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE,
			this.GetManaCostPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_UNIQUE,
			this.GetSlowResistanceUnique.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_UNIQUE,
			this.GetSpellAmplifyPercentageUnique.bind(this)
		]
	])

	protected GetManaCostPercentage(): [number, boolean] {
		return [100 + this.cachedManaCostReduction, false]
	}

	protected GetSlowResistanceUnique(): [number, boolean] {
		return [this.cachedSpeedResist, false]
	}

	protected GetSpellAmplifyPercentageUnique(): [number, boolean] {
		return [this.cachedSpellAmplify, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_kaya_and_sange"
		this.cachedSpellAmplify = this.GetSpecialValue("spell_amp", name)
		this.cachedSpeedResist = this.GetSpecialValue("slow_resistance", name)
		this.cachedManaCostReduction = this.GetSpecialValue("manacost_reduction", name)
	}
}
