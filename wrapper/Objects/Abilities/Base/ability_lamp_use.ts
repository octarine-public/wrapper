import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ability_lamp_use")
export class ability_lamp_use extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
