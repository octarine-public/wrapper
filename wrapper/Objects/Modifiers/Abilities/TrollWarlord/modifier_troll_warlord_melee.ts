import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_troll_warlord_melee extends Modifier {
	public SetFixedAttackRange(specialName = "bonus_range", _subtract = false): void {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		const baseAttackRange = owner.BaseAttackRange
		const bonusAttackRange = owner.BonusAttackRange
		const attackRange = baseAttackRange - value + bonusAttackRange
		this.FixedAttackRange = attackRange * owner.AttackRangeAmplifier
	}

	protected SetFixedBaseAttackTime(
		specialName = "base_attack_time",
		subtract = false
	): void {
		super.SetFixedBaseAttackTime(specialName, subtract)
	}
}
