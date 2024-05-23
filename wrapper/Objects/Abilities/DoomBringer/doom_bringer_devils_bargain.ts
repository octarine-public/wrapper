import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("doom_bringer_devils_bargain")
export class doom_bringer_devils_bargain extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
