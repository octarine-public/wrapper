import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_spectre_dispersion_boost extends Modifier {
	public CachedDamageReflection = 0

	protected UpdateSpecialValues(): void {
		this.CachedDamageReflection = this.GetSpecialValue(
			"activation_bonus_pct",
			"spectre_dispersion"
		)
	}
}
