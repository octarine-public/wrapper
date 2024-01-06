import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_warpath extends Modifier {
	public readonly IsBuff = true

	protected SetMoveSpeedAmplifier(
		specialName = "move_speed_per_stack",
		_subtract = false
	): void {
		const maxStacks = this.GetSpecialValue("max_stacks")
		const stack = Math.min(this.StackCount, maxStacks)
		const perStack = this.GetSpecialSpeedByState(specialName)
		this.BonusMoveSpeedAmplifier = (perStack * stack) / 100
	}
}
