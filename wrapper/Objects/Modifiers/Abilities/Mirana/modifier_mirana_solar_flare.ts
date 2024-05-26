import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mirana_solar_flare extends Modifier {
	// protected SetAttackSpeedAmplifier(
	// 	specialName = "increase_rate",
	// 	_subtract = false
	// ): void {
	// 	const ally = this.Caster !== this.Parent
	// 	const allyReduction = this.GetSpecialValue("ally_pct") / 100
	// 	const value = this.GetSpecialValue(specialName) * (ally ? allyReduction : 1)
	// 	this.AttackSpeedAmplifier = value
	// }

	public SetBonusAttackSpeed(_specialName?: string, _subtract = false): void {
		this.BonusAttackSpeed = this.StackCount
	}

	public SetBonusDayVision(_specialName?: string, _subtract = false): void {
		const multiFactor = this.GetSpecialValue("day_vision_multiplier")
		this.BonusDayVision = this.StackCount * multiFactor
	}
}
