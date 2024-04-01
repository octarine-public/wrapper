import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("seasonal_summon_ti9_balloon")
export class seasonal_summon_ti9_balloon extends Ability {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
