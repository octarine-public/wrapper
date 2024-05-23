import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("silencer_brain_drain")
export class silencer_brain_drain extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
