import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_oracle_fates_edict extends Modifier {
	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])

	protected GetMagicalResistanceBonus(): [number, boolean] {
		const owner = this.Parent,
			caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return [0, false]
		}
		return owner.IsEnemy(caster) ? [0, false] : [this.cachedMres, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedMres = this.GetSpecialValue(
			"magic_damage_resistance_pct_tooltip",
			"oracle_fates_edict"
		)
	}
}
