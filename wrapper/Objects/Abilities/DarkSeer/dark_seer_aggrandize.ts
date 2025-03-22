import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dark_seer_aggrandize")
export class dark_seer_aggrandize extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
