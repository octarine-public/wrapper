import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("invoker_chaos_meteor")
export default class invoker_chaos_meteor extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("area_of_effect")
	}
}
