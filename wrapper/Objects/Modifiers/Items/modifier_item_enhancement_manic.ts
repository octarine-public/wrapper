import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_manic extends Modifier {
	private cachedBAT = 0
	private cachedVision = 0
	private cachedCastTime = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_VISION_PERCENTAGE,
			this.GetBonusVisionPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_CASTTIME_PERCENTAGE,
			this.GetCastTimePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_PERCENTAGE,
			this.GetBaseAttackTimePercentage.bind(this)
		]
	])
	protected GetBonusVisionPercentage(): [number, boolean] {
		return [-this.cachedVision, false]
	}
	protected GetCastTimePercentage(): [number, boolean] {
		return [this.cachedCastTime, false]
	}
	protected GetBaseAttackTimePercentage(): [number, boolean] {
		return [-this.cachedBAT, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_enhancement_manic"
		this.cachedBAT = this.GetSpecialValue("bat_reduce", name)
		this.cachedCastTime = this.GetSpecialValue("cast_speed", name)
		this.cachedVision = this.GetSpecialValue("vision_reduce", name)
	}
}
