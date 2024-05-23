import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("axe_one_man_army")
export class axe_one_man_army extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
