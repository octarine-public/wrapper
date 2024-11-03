import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_magnataur_solid_core extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSpeed, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue("slow_resistance", "magnataur_solid_core")
	}
}
