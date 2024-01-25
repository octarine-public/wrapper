import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enchanted_quiver extends Modifier {
	public OnAbilityCooldownChanged(): void {
		this.SetBonusAttackRange()
	}

	public SetBonusAttackRange(
		specialName = "bonus_attack_range",
		_subtract = false
	): void {
		if (this.Ability === undefined || !this.IsRanged) {
			this.BonusAttackRange = 0
			return
		}
		const cooldown = this.Ability.Cooldown
		const specialNameBonus = "active_bonus_attack_range"
		const getBaseValue = this.GetSpecialValue(specialName)
		const getBonusValue = cooldown > 0 ? 0 : this.GetSpecialValue(specialNameBonus)
		this.BonusAttackRange = getBaseValue + getBonusValue
	}
}
