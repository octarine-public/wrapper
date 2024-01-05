import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("warlock_rain_of_chaos")
export class warlock_rain_of_chaos extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("aoe", level)
	}
}
