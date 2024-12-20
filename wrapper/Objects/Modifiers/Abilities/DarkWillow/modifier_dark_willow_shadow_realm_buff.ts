import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dark_willow_shadow_realm_buff extends Modifier {
	private cachedRange = 0
	private cachedDamage = 0
	private cachedMaxDamageTime = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetPreAttackBonusDamageMagical.bind(this)
		]
	])

	private get remainingDamage(): number {
		const multiplier = this.ElapsedTime / this.cachedMaxDamageTime
		return Math.min(this.cachedDamage * multiplier, this.cachedDamage)
	}

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected GetPreAttackBonusDamageMagical(): [number, boolean] {
		return [this.remainingDamage, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "dark_willow_shadow_realm"
		this.cachedDamage = this.GetSpecialValue("damage", name)
		this.cachedRange = this.GetSpecialValue("attack_range_bonus", name)
		this.cachedMaxDamageTime = this.GetSpecialValue("max_damage_duration", name)
	}
}
