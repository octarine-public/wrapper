import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("invoker_tornado")
export default class invoker_tornado extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("area_of_effect")
	}
}
