import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("chaos_knight_phantasmagoria")
export class chaos_knight_phantasmagoria extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
