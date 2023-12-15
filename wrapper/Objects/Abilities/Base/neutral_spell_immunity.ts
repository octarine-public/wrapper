import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("neutral_spell_immunity")
export class neutral_spell_immunity extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
