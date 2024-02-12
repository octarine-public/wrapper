import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mirana_leap extends Modifier {
	protected SetFixedTurnRate(_specialName?: string, _subtract = false): void {
		this.FixedTurnRate = -1
	}
}
