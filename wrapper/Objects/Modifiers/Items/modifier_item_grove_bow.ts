import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_grove_bow extends Modifier {
	private cachedRange = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackRangeBonus(): [number, boolean] {
		return [(this.Parent?.IsRanged ?? false) ? this.cachedRange : 0, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_grove_bow"
		this.cachedRange = this.GetSpecialValue("attack_range_bonus", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed_bonus", name)
	}
}
