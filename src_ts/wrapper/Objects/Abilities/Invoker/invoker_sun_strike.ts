import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("invoker_sun_strike")
export default class invoker_sun_strike extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("area_of_effect")
	}
}
