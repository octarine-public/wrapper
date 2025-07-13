import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("riki_innate_backstab")
export class riki_innate_backstab extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
