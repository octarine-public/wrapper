import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_alert extends Modifier {
	private cachedAttackSpeed = 0
	private cachedBonusNightVision = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION,
			this.GetBonusNightVision.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	protected GetBonusNightVision(): [number, boolean] {
		return [this.cachedBonusNightVision, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_enhancement_alert"
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
		this.cachedBonusNightVision = this.GetSpecialValue("bonus_night_vision", name)
	}
}
