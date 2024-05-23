import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lion_to_hell_and_back")
export class lion_to_hell_and_back extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
