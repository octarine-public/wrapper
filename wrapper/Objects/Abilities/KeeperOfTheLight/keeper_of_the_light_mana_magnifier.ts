import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("keeper_of_the_light_mana_magnifier")
export class keeper_of_the_light_mana_magnifier extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
