import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("gyrocopter_chop_shop")
export class gyrocopter_chop_shop extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
