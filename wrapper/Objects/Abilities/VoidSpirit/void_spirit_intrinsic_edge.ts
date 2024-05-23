import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("void_spirit_intrinsic_edge")
export class void_spirit_intrinsic_edge extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
