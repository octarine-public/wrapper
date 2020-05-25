import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("invoker_emp")
export default class invoker_emp extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("area_of_effect")
	}
}
