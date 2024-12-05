import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_hoodwink_bushwhack_trap extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_FIXED_DAY_VISION,
			this.GetFixedDayVision.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_FIXED_NIGHT_VISION,
			this.GetFixedNightVision.bind(this)
		]
	])

	protected GetFixedDayVision(): [number, boolean] {
		return [1, this.IsMagicImmune()]
	}

	protected GetFixedNightVision(): [number, boolean] {
		return [1, this.IsMagicImmune()]
	}
}
