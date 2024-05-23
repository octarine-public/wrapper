import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("windrunner_easy_breezy")
export class windrunner_easy_breezy extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
