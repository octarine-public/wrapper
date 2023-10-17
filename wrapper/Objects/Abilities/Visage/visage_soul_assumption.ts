import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("visage_soul_assumption")
export class visage_soul_assumption extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("bolt_speed")
	}
}
