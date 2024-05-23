import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("crystal_maiden_blueheart_floe")
export class crystal_maiden_blueheart_floe extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
