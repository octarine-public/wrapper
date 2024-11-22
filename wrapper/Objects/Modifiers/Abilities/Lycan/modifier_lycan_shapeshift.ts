import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lycan_shapeshift extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION,
			this.GetBonusNightVision.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAX_ATTACK_RANGE,
			this.GetMaxAttackRange.bind(this)
		]
	])

	private cachedRange = 150 // no special value
	private cachedVision = 0

	protected GetMaxAttackRange(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected GetBonusNightVision(): [number, boolean] {
		return [this.cachedVision, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedVision = this.GetSpecialValue("bonus_night_vision", "lycan_shapeshift")
	}
}
