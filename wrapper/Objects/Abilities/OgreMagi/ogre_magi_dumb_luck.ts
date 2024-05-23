import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ogre_magi_dumb_luck")
export class ogre_magi_dumb_luck extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
