import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("pugna_oblivion_savant")
export class pugna_oblivion_savant extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
