import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mars_arena_kill_buff extends Modifier {
	private cachedBonusDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])

	protected GetPreAttackBonusDamagePercentage(): [number, boolean] {
		return [this.cachedBonusDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedBonusDamage = this.GetSpecialValue(
			"arena_kill_buff_damage_pct",
			"mars_arena_of_blood"
		)
	}
}
