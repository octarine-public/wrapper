import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_mars_spear_burning_trail_burn extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(
		specialName = "shard_move_slow_pct",
		subtract = true
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
