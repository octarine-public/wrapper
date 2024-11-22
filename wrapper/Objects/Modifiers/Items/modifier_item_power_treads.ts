import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_power_treads extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE,
			this.GetMoveSpeedBonusUnique.bind(this)
		]
	])

	private cachedSpeedMelee = 0
	private cachedSpeedRanged = 0

	protected GetMoveSpeedBonusUnique(): [number, boolean] {
		const value = this.HasMeleeAttacksBonuses()
			? this.cachedSpeedMelee
			: this.cachedSpeedRanged
		return [value, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_power_treads"
		this.cachedSpeedMelee = this.GetSpecialValue("bonus_movement_speed_melee", name)
		this.cachedSpeedRanged = this.GetSpecialValue("bonus_movement_speed_ranged", name)
	}
}
