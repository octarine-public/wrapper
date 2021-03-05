import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("faceless_void_time_walk")
export default class faceless_void_time_walk extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("range", level)
	}
}
