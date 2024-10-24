import { WrapperClassModifier } from "../../../../Decorators"
import { DegreesToRadian } from "../../../../Utils/Math"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_hoodwink_sharpshooter_windup extends Modifier {
	protected SetFixedTurnRate(specialName = "turn_rate", _subtract = false): void {
		// https://dota2.fandom.com/wiki/Clockwerk
		this.FixedTurnRate = DegreesToRadian(this.GetSpecialValue(specialName))
	}
}
