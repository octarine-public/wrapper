import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("grimstroke_ink_trail")
export class grimstroke_ink_trail extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
