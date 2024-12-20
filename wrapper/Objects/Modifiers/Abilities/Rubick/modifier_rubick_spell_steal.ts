import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rubick_spell_steal extends Modifier {
	public CachedSpellAmpDamage = 0
	public CachedManaCostReduction = 0

	protected UpdateSpecialValues(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.CachedSpellAmpDamage = 0
			this.CachedManaCostReduction = 0
			return
		}
		this.CachedManaCostReduction = this.GetSpecialValue(
			"stolen_mana_reduction",
			"rubick_spell_steal"
		)
		const ability = owner.GetAbilityByName("special_bonus_unique_rubick_5")
		if (ability === undefined) {
			this.CachedSpellAmpDamage = 0
			return
		}
		this.CachedSpellAmpDamage = ability?.GetSpecialValue("value") ?? 0
	}
}
