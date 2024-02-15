import { WrapperClassModifier } from "../../../../Decorators"
import { DegreesToRadian } from "../../../../Utils/Math"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_pangolier_rollup extends Modifier {
	public readonly IsBuff = true

	protected SetFixedTurnRate(specialName = "turn_rate", _subtract = false) {
		this.FixedTurnRate = DegreesToRadian(this.GetSpecialValue(specialName))
	}
}
