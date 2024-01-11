import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_wisp_overcharge extends Modifier {
	public readonly IsBuff = true

	protected SetStatusResistanceSpeed(
		specialName = "shard_bonus_slow_resistance",
		subtract = true
	): void {
		super.SetStatusResistanceSpeed(specialName, subtract)
	}
}
