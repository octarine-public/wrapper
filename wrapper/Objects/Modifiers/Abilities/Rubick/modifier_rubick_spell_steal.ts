import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rubick_spell_steal extends Modifier {
	public CachedManaCostReduction = 0

	protected UpdateSpecialValues(): void {
		this.CachedManaCostReduction = this.GetSpecialValue(
			"stolen_mana_reduction",
			"rubick_spell_steal"
		)
	}
}
