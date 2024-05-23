import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dawnbreaker_land")
export class dawnbreaker_land extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
