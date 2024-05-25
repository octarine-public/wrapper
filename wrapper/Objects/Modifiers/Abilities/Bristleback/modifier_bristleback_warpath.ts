import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_warpath extends Modifier {
	public readonly IsBuff = true

	private get getStackCount(): number {
		return Math.min(this.StackCount, this.GetSpecialValue("max_stacks"))
	}

	protected SetMoveSpeedAmplifier(
		specialName = "move_speed_per_stack",
		_subtract = false
	): void {
		const perStack = this.GetSpecialMoveSpeedByState(specialName)
		this.BonusMoveSpeedAmplifier = (perStack * this.getStackCount) / 100
	}

	protected SetBonusAttackSpeed(
		specialName = "aspd_per_stack",
		_subtract = false
	): void {
		const perStack = this.GetSpecialAttackSpeedByState(specialName)
		this.BonusAttackSpeed = perStack * this.getStackCount
	}
}
