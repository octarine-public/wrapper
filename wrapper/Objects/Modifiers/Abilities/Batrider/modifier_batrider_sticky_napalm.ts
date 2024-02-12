import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_batrider_sticky_napalm extends Modifier {
	public readonly IsDebuff = true

	protected SetTurnRateAmplifier(
		specialName = "turn_rate_pct",
		subtract = false
	): void {
		super.SetTurnRateAmplifier(specialName, subtract)
	}
}
