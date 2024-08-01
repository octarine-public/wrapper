import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("beastmaster_rugged")
export class beastmaster_rugged extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
