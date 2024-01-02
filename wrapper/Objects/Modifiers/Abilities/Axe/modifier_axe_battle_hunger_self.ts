import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_battle_hunger_self extends Modifier {
	public readonly IsBuff = true

	public SetMoveSpeedAmplifier(specialName = "speed_bonus", subtract = false): void {
		if (this.StackCount === 0) {
			this.BonusMoveSpeedAmplifier = 0
			return
		}
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	protected ExceptionMessage(_specialName: string, _value: number) {
		// without exception
	}
}
