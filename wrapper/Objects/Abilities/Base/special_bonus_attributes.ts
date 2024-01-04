import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("special_bonus_attributes")
export class special_bonus_attributes extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
