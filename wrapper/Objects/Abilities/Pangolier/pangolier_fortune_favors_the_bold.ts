import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("pangolier_fortune_favors_the_bold")
export class pangolier_fortune_favors_the_bold extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
