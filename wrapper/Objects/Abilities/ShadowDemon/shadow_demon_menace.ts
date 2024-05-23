import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("shadow_demon_menace")
export class shadow_demon_menace extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
