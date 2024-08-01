import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("abaddon_withering_mist")
export class abaddon_withering_mist extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
