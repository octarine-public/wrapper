import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_warpath extends Modifier {
	public readonly IsBuff = true

	public SetBonusMoveBaseAmplifier(
		specialName = "move_speed_per_stack",
		_subtract = false
	): void {
		const stack = this.StackCount
		const perStack = this.GetSpecialSpeedByState(specialName)
		const value = (perStack * Math.max(1, stack)) / 100
		this.MoveSpeedBaseAmplifier = value
	}
}
