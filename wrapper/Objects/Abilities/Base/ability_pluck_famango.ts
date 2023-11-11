import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ability_pluck_famango")
export class ability_pluck_famango extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
