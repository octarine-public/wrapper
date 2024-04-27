import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_vindicators_axe extends Modifier {
	protected SetBonusAttackSpeed(
		specialName = "bonus_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected SetBonusArmor(specialName = "bonus_armor", _subtract = false): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.BonusArmor = 0
			return
		}
		this.BonusArmor = owner.IsStunned ? this.GetSpecialValue(specialName) : 0
	}
}
