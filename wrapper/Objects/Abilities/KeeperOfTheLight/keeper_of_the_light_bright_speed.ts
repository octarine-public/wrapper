import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("keeper_of_the_light_bright_speed")
export class keeper_of_the_light_bright_speed extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
