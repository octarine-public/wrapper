import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("vengefulspirit_retribution")
export class vengefulspirit_retribution extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
