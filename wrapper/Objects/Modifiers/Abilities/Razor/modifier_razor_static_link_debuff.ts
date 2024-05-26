import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_razor_static_link_debuff extends Modifier {
	protected SetBonusAttackSpeed(
		specialName = "attack_speed_factor",
		_subtract = false
	): void {
		const canBeSteal = this.GetSpecialValue(specialName) !== 0
		this.BonusAttackSpeed = canBeSteal ? this.StackCount * -1 : 0
	}
}
