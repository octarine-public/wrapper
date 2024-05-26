import { WrapperClassModifier } from "../../../../Decorators"
import { DegreesToRadian } from "../../../../Utils/Math"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rattletrap_jetpack extends Modifier {
	public get DeltaZ(): number {
		return 260
	}
	protected SetFixedTurnRate(specialName = "turn_rate", _subtract = false): void {
		// https://dota2.fandom.com/wiki/Clockwerk
		this.FixedTurnRate = DegreesToRadian(this.GetSpecialValue(specialName))
	}
}
