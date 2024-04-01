import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("seasonal_summon_cny_balloon")
export class seasonal_summon_cny_balloon extends Ability {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
