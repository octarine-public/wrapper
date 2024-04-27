import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_viscous_nasal_goo extends Modifier {
	public readonly IsDebuff = true

	protected SetBaseMoveSpeedAmplifier(
		specialName = "base_move_slow",
		_subtract = true
	): void {
		const stack = this.GetMaxStackCount()
		const baseSlow = this.GetSpecialMoveSpeedByState(specialName)
		const moveStackSlow = this.GetSpecialMoveSpeedByState("move_slow_per_stack")
		const value = ((baseSlow + moveStackSlow) * stack) / -100
		this.MoveSpeedBaseAmplifier = value
	}

	protected SetBaseBonusArmor(specialName = "base_armor", _subtract = true) {
		const stack = this.GetMaxStackCount()
		const perStack = this.GetSpecialMoveSpeedByState("armor_per_stack")
		const value = this.GetSpecialArmorByState(specialName)
		this.BaseBonusArmor = -(value + perStack * stack)
	}

	protected GetMaxStackCount() {
		return Math.min(this.StackCount, this.GetSpecialValue("stack_limit"))
	}
}
