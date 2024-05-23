import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bloodseeker_sanguivore")
export class bloodseeker_sanguivore extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
