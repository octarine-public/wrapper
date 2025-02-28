import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_magnifying_monocle extends Modifier {
	private cachedCastRange = 0
	private cachedAttackRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS,
			this.GetCastRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	protected GetCastRangeBonus(): [number, boolean] {
		return (this.Ability?.IsCooldownReady ?? false)
			? [this.cachedCastRange, false]
			: [0, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return (this.Ability?.IsCooldownReady ?? false)
			? [this.cachedAttackRange, false]
			: [0, false]
	}
	protected UpdateSpecialValues() {
		const name = "item_magnifying_monocle"
		this.cachedCastRange = this.GetSpecialValue("bonus_cast_range", name)
		this.cachedAttackRange = this.GetSpecialValue("bonus_attack_range", name)
	}
}
