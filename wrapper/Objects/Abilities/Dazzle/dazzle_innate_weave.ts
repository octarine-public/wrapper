import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dazzle_innate_weave")
export class dazzle_innate_weave extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
