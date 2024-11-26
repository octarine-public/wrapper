import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_moon_shard extends Modifier {
	protected CachedNightVision = 0
	protected CachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION_UNIQUE,
			this.GetBonusNightVisionUnique.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.CachedAttackSpeed, false]
	}

	protected GetBonusNightVisionUnique(): [number, boolean] {
		return [this.CachedNightVision, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "item_moon_shard"
		this.CachedNightVision = this.GetSpecialValue("bonus_night_vision", name)
		this.CachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
	}
}
