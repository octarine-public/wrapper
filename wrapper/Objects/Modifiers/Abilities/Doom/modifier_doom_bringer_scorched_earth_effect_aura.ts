import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_doom_bringer_scorched_earth_effect_aura extends Modifier {
	public readonly IsBuff = true

	protected SetMoveSpeedAmplifier(
		specialName = "bonus_movement_speed_pct",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
