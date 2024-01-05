import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_viscous_nasal_goo extends Modifier {
	public readonly IsDebuff = true

	public SetBonusMoveBaseAmplifier(
		specialName = "base_move_slow",
		_subtract = true
	): void {
		const stack = this.StackCount
		const baseSlow = this.GetSpecialSpeedByState(specialName)
		const moveStackSlow = this.GetSpecialSpeedByState("move_slow_per_stack")
		const value = (baseSlow + moveStackSlow * Math.max(1, stack)) / -100
		this.MoveSpeedBaseAmplifier = value
	}
}
