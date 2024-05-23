import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dawnbreaker_break_of_dawn")
export class dawnbreaker_break_of_dawn extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
