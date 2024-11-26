import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_power_treads extends Modifier {
	private cachedSpeedMelee = 0
	private cachedSpeedRanged = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE,
			this.GetMoveSpeedBonusUnique.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetMoveSpeedBonusUnique(): [number, boolean] {
		const value = this.HasMeleeAttacksBonuses()
			? this.cachedSpeedMelee
			: this.cachedSpeedRanged
		return [value, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_power_treads"
		this.cachedSpeedMelee = this.GetSpecialValue("bonus_movement_speed_melee", name)
		this.cachedSpeedRanged = this.GetSpecialValue("bonus_movement_speed_ranged", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
	}
}
