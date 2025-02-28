import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_boundless extends Modifier {
	private cachedCastRange = 0
	private cachedAttackRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS,
			this.GetCastRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])
	protected GetCastRangeBonus(): [number, boolean] {
		return [this.cachedCastRange, false]
	}
	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedAttackRange, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_enhancement_boundless"
		this.cachedCastRange = this.GetSpecialValue("bonus_cast_range", name)
		this.cachedAttackRange = this.GetSpecialValue("bonus_attack_range", name)
	}
}
