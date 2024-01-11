import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ogre_magi_ignite extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(
		specialName = "slow_movement_speed_pct",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
