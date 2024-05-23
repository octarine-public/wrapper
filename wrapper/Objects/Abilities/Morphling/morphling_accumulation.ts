import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("morphling_accumulation")
export class morphling_accumulation extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
