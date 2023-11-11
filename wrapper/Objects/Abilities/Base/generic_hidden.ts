import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("generic_hidden")
export class generic_hidden extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
