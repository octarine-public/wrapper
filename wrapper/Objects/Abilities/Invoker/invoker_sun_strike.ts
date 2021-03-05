import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("invoker_sun_strike")
export default class invoker_sun_strike extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("area_of_effect", level)
	}
}
