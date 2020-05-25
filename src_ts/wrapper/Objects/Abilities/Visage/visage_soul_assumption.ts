import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("visage_soul_assumption")
export default class visage_soul_assumption extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("bolt_speed")
	}
}
