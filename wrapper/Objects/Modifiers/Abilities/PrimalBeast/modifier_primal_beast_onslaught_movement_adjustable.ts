import { WrapperClassModifier } from "../../../../Decorators"
import { DegreesToRadian } from "../../../../Utils/Math"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_onslaught_movement_adjustable extends Modifier {
	protected SetFixedTurnRate(specialName = "turn_rate", _subtract = false) {
		this.FixedTurnRate = DegreesToRadian(this.GetSpecialValue(specialName))
	}
}
