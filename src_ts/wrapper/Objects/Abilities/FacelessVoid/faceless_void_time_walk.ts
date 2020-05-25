import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("faceless_void_time_walk")
export default class faceless_void_time_walk extends Ability {
	public get BaseCastRange(): number {
		return this.GetSpecialValue("range")
	}
}
