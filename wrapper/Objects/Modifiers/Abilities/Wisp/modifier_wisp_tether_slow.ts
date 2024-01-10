import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_wisp_tether_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetStatusResistanceSpeed(specialName = "slow", subtract = true): void {
		super.SetStatusResistanceSpeed(specialName, subtract)
	}
}
