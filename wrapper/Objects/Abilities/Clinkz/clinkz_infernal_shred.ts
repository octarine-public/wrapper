import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("clinkz_infernal_shred")
export class clinkz_infernal_shred extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
