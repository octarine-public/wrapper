import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ability_capture")
export class ability_capture extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
