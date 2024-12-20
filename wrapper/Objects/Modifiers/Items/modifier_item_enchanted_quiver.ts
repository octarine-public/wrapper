import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enchanted_quiver extends Modifier {
	private cachedDamage = 0
	private cachedActiveRange = 0
	private cachedPassiveRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetProcAttackBonusDamageMagical.bind(this)
		]
	])

	protected GetAttackRangeBonus(): [number, boolean] {
		const owner = this.Parent,
			ability = this.Ability
		if (ability === undefined || owner === undefined || owner.IsMelee) {
			return [0, false]
		}
		let value = this.cachedPassiveRange
		if (ability.IsCooldownReady) {
			value += this.cachedActiveRange
		}
		return [value, false]
	}

	protected GetProcAttackBonusDamageMagical(): [number, boolean] {
		const ability = this.Ability
		if (ability === undefined || !ability.IsCooldownReady) {
			return [0, false]
		}
		return [this.cachedDamage, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_enchanted_quiver"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedActiveRange = this.GetSpecialValue("active_bonus_attack_range", name)
		this.cachedPassiveRange = this.GetSpecialValue("bonus_attack_range", name)
	}
}
