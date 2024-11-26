import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_vampire_fangs extends Modifier {
	private cachedNightVision = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION,
			this.GetBonusNightVision.bind(this)
		]
	])

	protected GetBonusNightVision(): [number, boolean] {
		return [this.cachedNightVision, false]
	}

	protected UpdateSpecialValues() {
		this.cachedNightVision = this.GetSpecialValue(
			"night_vision",
			"item_vampire_fangs"
		)
	}
}
