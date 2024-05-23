import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("death_prophet_witchcraft")
export class death_prophet_witchcraft extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
