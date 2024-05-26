import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_beastmaster_inner_beast extends Modifier {
	protected SetBonusAttackSpeed(
		specialName = "bonus_attack_speed",
		_subtract = false
	): void {
		const value = this.GetSpecialAttackSpeedByState(specialName)
		this.BonusAttackSpeed = value + this.NetworkDamage
	}
}
