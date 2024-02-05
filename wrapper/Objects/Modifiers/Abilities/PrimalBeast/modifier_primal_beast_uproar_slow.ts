import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_uproar_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(
		specialName = "move_slow_per_stack",
		_subtract = true
	): void {
		const maxStacks = this.GetSpecialValue("stack_limit")
		const stack = Math.min(this.StackCount, maxStacks)
		const moveStackSlow = this.GetSpecialMoveSpeedByState(specialName)
		this.BonusMoveSpeedAmplifier = (moveStackSlow * stack) / -100
	}
}
