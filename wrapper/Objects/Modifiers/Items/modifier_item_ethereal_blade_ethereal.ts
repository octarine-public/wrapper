import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ethereal_blade_ethereal extends Modifier {
	public readonly IsGhost = true

	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DECREPIFY_UNIQUE,
			this.GetMagicalResistanceDecrepifyUnique.bind(this)
		]
	])

	protected GetMagicalResistanceDecrepifyUnique(): [number, boolean] {
		return [this.cachedMres, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedMres = this.GetSpecialValue(
			"ethereal_damage_bonus",
			"item_ethereal_blade"
		)
	}
}
