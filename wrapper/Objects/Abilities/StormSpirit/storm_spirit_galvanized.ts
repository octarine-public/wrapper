import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("storm_spirit_galvanized")
export class storm_spirit_galvanized extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
