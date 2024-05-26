import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_medusa_manashield_attack_buff extends Modifier {
	protected SetBonusAttackSpeed(
		_specialName = "aspd_increase_rate_pct",
		_subtract = false
	): void {
		const increaseMax = this.GetSpecialValue("aspd_increase_max_tooltip")
		const staclCount = Math.min(this.StackCount, increaseMax)
		this.BonusAttackSpeed = staclCount
	}
}
