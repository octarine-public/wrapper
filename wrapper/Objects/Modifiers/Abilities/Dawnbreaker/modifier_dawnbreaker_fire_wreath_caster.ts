import { WrapperClassModifier } from "../../../../Decorators"
import { DegreesToRadian } from "../../../../Utils/Math"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dawnbreaker_fire_wreath_caster extends Modifier {
	protected SetMoveSpeedAmplifier(
		specialName = "shard_movement_penalty",
		subtract = true
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	protected SetFixedTurnRate(specialName = "turn_rate", _subtract = false) {
		this.FixedTurnRate = DegreesToRadian(this.GetSpecialValue(specialName))
	}
}
