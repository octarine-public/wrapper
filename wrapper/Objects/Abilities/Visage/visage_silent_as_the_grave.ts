import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("visage_silent_as_the_grave")
export class visage_silent_as_the_grave extends Ability {
	public get IsInvisibility(): boolean {
		return this.Owner?.HasScepter ?? false
	}
}
