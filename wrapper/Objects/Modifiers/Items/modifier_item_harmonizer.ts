import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_harmonizer extends Modifier {
	public readonly IsHidden = false
	private cachedSpellAmplify = 0
	private cachedManaCostReduction = 0
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING,
			this.GetManaCostPercentageStacking.bind(this)
		]
	])
	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return [this.cachedSpellAmplify * this.NetworkDamage, false]
	}
	protected GetManaCostPercentageStacking(): [number, boolean] {
		return [this.cachedManaCostReduction * this.NetworkArmor, false]
	}
	protected UpdateSpecialValues() {
		const name = "item_harmonizer"
		this.cachedSpellAmplify = this.GetSpecialValue("spell_amp", name)
		this.cachedManaCostReduction = this.GetSpecialValue("manacost_reduction", name)
	}
}
