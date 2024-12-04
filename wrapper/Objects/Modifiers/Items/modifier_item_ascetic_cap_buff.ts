import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ascetic_cap_buff extends Modifier {
	private cachedSlowResist = 0
	private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE,
			this.GetStatusResistance.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])

	protected GetStatusResistance(): [number, boolean] {
		return [this.cachedStatusResist, false]
	}

	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSlowResist, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_ascetic_cap"
		this.cachedSlowResist = this.GetSpecialValue("slow_resistance", name)
		this.cachedStatusResist = this.GetSpecialValue("status_resistance", name)
	}
}
