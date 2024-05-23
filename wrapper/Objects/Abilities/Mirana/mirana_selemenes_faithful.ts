import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("mirana_selemenes_faithful")
export class mirana_selemenes_faithful extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
