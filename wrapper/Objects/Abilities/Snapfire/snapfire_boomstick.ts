import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("snapfire_boomstick")
export class snapfire_boomstick extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
