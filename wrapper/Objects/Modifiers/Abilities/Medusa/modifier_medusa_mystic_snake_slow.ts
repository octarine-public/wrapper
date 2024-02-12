import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_medusa_mystic_snake_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetTurnRateAmplifier(specialName = "turn_slow", subtract = true): void {
		super.SetTurnRateAmplifier(specialName, subtract)
	}
}
