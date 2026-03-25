import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_hydras_breath extends Modifier {
	private cachedRange = 0
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamage, false]
	}
	protected GetAttackRangeBonus(): [number, boolean] {
		const isRanged = this.Parent?.IsRanged ?? false
		return [isRanged ? this.cachedRange : 0, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_hydras_breath"
		this.cachedDamage = this.GetSpecialValue("damage", name)
		this.cachedRange = this.GetSpecialValue("secondary_target_range_bonus", name)
	}
}
