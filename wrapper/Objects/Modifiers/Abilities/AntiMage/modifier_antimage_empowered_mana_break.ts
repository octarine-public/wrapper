import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_antimage_empowered_mana_break extends Modifier {
	public CachedBonusManaBurn = 0

	protected UpdateSpecialValues() {
		this.CachedBonusManaBurn = this.GetSpecialValue(
			"empowered_max_burn_pct_tooltip",
			"antimage_blink"
		)
	}
}
