import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_sange extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_UNIQUE,
			this.GetSlowResistanceUnique.bind(this)
		]
	])

	private cachedSpeedResist = 0

	protected GetSlowResistanceUnique(): [number, boolean] {
		return [this.cachedSpeedResist, false]
	}

	protected UpdateSpecialValues() {
		this.cachedSpeedResist = this.GetSpecialValue("slow_resistance", "item_sange")
	}
}
