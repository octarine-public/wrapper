import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_crystal_maiden_arcane_overflow_active
	extends Modifier
	implements IBuff
{
	public CachedSpellAmplify = 1
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedManaCost = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING,
			this.GetManaCostPercentage.bind(this)
		]
	])

	public IsBuff(): this is IBuff {
		return true
	}
	protected GetManaCostPercentage(): [number, boolean] {
		return [-this.cachedManaCost, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "crystal_maiden_brilliance_aura"
		this.CachedSpellAmplify = this.GetSpecialValue("activation_spell_amp_pct", name)
		this.cachedManaCost = this.GetSpecialValue(
			"activation_mana_cost_increase_pct",
			name
		)
	}
}
