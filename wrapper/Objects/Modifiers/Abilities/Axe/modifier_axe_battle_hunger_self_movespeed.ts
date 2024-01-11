import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_battle_hunger_self_movespeed extends Modifier {
	public readonly IsBuff = true

	public SetMoveSpeedAmplifier(specialName = "speed_bonus", subtract = false): void {
		if (this.StackCount !== 0) {
			super.SetMoveSpeedAmplifier(specialName, subtract)
			return
		}
		this.BonusMoveSpeedAmplifier = 0
	}
}
