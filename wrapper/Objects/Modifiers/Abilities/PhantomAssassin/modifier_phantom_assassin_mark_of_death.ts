import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_phantom_assassin_mark_of_death extends Modifier {
	private cachedCritDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CRITICAL_STRIKE_BONUS,
			this.GetCriticalStrikeBonus.bind(this)
		]
	])

	protected GetCriticalStrikeBonus(): [number, boolean] {
		return [this.cachedCritDamage, this.IsPassiveDisabled() || this.IsSuppressCrit()]
	}

	protected UpdateSpecialValues() {
		this.cachedCritDamage = this.GetSpecialValue(
			"crit_bonus",
			"phantom_assassin_coup_de_grace"
		)
	}
}
