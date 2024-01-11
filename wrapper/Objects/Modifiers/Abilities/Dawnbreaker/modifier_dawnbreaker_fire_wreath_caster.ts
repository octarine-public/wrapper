import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dawnbreaker_fire_wreath_caster extends Modifier {
	protected SetMoveSpeedAmplifier(
		specialName = "shard_movement_penalty",
		subtract = true
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
