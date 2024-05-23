import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lycan_apex_predator")
export class lycan_apex_predator extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
