import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("invoker_chaos_meteor")
export default class invoker_chaos_meteor extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("area_of_effect", level)
	}
}
