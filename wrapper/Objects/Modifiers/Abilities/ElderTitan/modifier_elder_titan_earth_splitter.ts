import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_elder_titan_earth_splitter extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(specialName = "slow_pct", subtract = true): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
