import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("doom_bringer_lvl_pain")
export class doom_bringer_lvl_pain extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
