import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_gyrocopter_rocket_barrage extends Modifier {
	public readonly IsBuff = true

	protected SetStatusResistanceSpeed(
		specialName = "slow_resistance",
		subtract = true
	): void {
		super.SetStatusResistanceSpeed(specialName, subtract)
	}
}
