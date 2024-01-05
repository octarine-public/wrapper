import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("neutral_upgrade")
export class neutral_upgrade extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
