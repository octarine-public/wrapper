import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_angels_demise extends Modifier {
	private cachedSpellCritFlat = 0
	private cachedAttackDamageMul = 0

	protected UpdateSpecialValues() {
		const name = "item_angels_demise"
		this.cachedSpellCritFlat = this.GetSpecialValue("spell_crit_flat", name)
		this.cachedAttackDamageMul = this.GetSpecialValue("spell_crit_multiplier", name)
	}
}
