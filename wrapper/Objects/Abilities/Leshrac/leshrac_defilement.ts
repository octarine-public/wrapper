import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("leshrac_defilement")
export class leshrac_defilement extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
