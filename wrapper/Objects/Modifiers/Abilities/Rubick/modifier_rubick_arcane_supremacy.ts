import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rubick_arcane_supremacy extends Modifier {
	private cachedSpellAmp = 0
	private cachedCastRange = 0
	private cachedAOERadius = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING,
			this.GetCastRangeBonusStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_CONSTANT_STACKING,
			this.GetAoeBonusConstantStacking.bind(this)
		]
	])

	protected GetCastRangeBonusStacking(): [number, boolean] {
		return [this.cachedCastRange, this.IsPassiveDisabled()]
	}

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedSpellAmp, this.IsPassiveDisabled()]
	}

	protected GetAoeBonusConstantStacking(): [number, boolean] {
		return [this.cachedAOERadius * this.StackCount, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		const name = "rubick_arcane_supremacy"
		this.cachedSpellAmp = this.GetSpecialValue("spell_amp", name)
		this.cachedAOERadius = this.GetSpecialValue("aoe_bonus", name)
		this.cachedCastRange = this.GetSpecialValue("cast_range", name)
	}
}
