import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_viscous_nasal_goo extends Modifier {
	public readonly IsDebuff = true

	protected SetBaseMoveSpeedAmplifier(
		specialName = "base_move_slow",
		_subtract = true
	): void {
		const maxStacks = this.GetSpecialValue("stack_limit")
		const stack = Math.min(this.StackCount, maxStacks)
		const baseSlow = this.GetSpecialMoveSpeedByState(specialName)
		const moveStackSlow = this.GetSpecialMoveSpeedByState("move_slow_per_stack")
		const value = ((baseSlow + moveStackSlow) * stack) / -100
		this.MoveSpeedBaseAmplifier = value
	}
}
