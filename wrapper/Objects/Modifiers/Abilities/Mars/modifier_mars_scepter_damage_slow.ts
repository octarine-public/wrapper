import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mars_scepter_damage_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(
		specialName = "scepter_movement_slow_pct",
		subtract = true
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
