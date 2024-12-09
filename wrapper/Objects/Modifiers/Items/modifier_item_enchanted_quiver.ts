import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enchanted_quiver extends Modifier {
	private cachedActiveRange = 0
	private cachedPassiveRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	protected GetAttackRangeBonus(): [number, boolean] {
		const ability = this.Ability,
			owner = this.Parent
		if (ability === undefined || (owner?.IsMelee ?? false)) {
			return [0, false]
		}
		let value = this.cachedPassiveRange
		if (ability.IsCooldownReady) {
			value += this.cachedActiveRange
		}
		return [value, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_enchanted_quiver"
		this.cachedActiveRange = this.GetSpecialValue("active_bonus_attack_range", name)
		this.cachedPassiveRange = this.GetSpecialValue("bonus_attack_range", name)
	}
}
