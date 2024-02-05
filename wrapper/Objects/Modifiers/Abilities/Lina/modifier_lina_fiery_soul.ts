import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lina_fiery_soul extends Modifier {
	public readonly IsBuff = true

	public SetBonusAttackSpeed(
		specialName = "fiery_soul_attack_speed_bonus",
		subtract = false
	): void {
		const maxStack = this.GetStacks()
		const value = this.GetSpecialAttackSpeedByState(specialName)
		this.BonusAttackSpeed = (subtract ? value * -1 : value) * maxStack
	}

	public SetMoveSpeedAmplifier(
		specialName = "fiery_soul_move_speed_bonus",
		subtract = false
	): void {
		const maxStack = this.GetStacks()
		const value = this.GetSpecialAttackSpeedByState(specialName)
		this.BonusMoveSpeedAmplifier = ((subtract ? value * -1 : value) / 100) * maxStack
	}

	private GetStacks() {
		const maxStacks = this.GetSpecialValue("fiery_soul_max_stacks")
		return Math.min(this.StackCount, maxStacks)
	}
}
