import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_corrosive_weaponry_debuff extends Modifier {
	public readonly IsDebuff = true

	public SetMoveSpeedAmplifier(specialName = "slow_per_stack", _subtract = true): void {
		const maxStacks = this.GetSpecialValue("max_stacks")
		const valueByState = this.GetSpecialMoveSpeedByState(specialName)
		const value = Math.min(this.StackCount, maxStacks) * valueByState
		this.BonusMoveSpeedAmplifier = (value * -1) / 100
	}
}
