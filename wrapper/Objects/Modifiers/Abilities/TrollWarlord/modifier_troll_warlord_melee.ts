import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_troll_warlord_melee extends Modifier {
	private cachedBAT = 0
	private cachedRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT,
			this.GetBaseAttackTimeConstant.bind(this)
		]
	])

	protected GetBaseAttackTimeConstant(): [number, boolean] {
		return [this.cachedBAT, false]
	}

	protected GetAttackRangeBonus(): [number, boolean] {
		return [-this.cachedRange, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "troll_warlord_switch_stance"
		this.cachedBAT = this.GetSpecialValue("base_attack_time", name)
		this.cachedRange = this.GetSpecialValue("bonus_range", name)
	}
}
