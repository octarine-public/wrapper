import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_havoc_hammer_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetAmplifierMoveSpeed(specialName = "slow", subtract = true): void {
		super.SetAmplifierMoveSpeed(specialName, subtract)
	}
}
