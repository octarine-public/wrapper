import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tusk_bitter_chill")
export class tusk_bitter_chill extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
