import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_magnataur_solid_core extends Modifier {
	private cachedSlowResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])
	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSlowResist, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		const name = "magnataur_solid_core"
		this.cachedSlowResist = this.GetSpecialValue(
			"slow_resistance",
			name,
			Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
		)
	}
}
