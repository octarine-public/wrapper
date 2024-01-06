import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_warpath extends Modifier {
	public readonly IsBuff = true

	public SetMoveSpeedAmplifier(
		specialName = "move_speed_per_stack",
		_subtract = false
	): void {
		const stack = this.StackCount
		const perStack = this.GetSpecialSpeedByState(specialName)
		this.BonusMoveSpeedAmplifier = (perStack * stack) / 100
	}
}
