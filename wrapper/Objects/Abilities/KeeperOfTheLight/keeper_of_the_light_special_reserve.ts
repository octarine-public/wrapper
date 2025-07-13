import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("keeper_of_the_light_special_reserve")
export class keeper_of_the_light_special_reserve extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
