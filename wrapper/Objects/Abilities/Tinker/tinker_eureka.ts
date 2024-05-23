import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tinker_eureka")
export class tinker_eureka extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
