import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ice_vortex extends Modifier {
	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedMres = this.GetSpecialValue(
			"spell_resist_pct",
			"ancient_apparition_ice_vortex"
		)
	}
}
