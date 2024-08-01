import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("venomancer_sepsis")
export class venomancer_sepsis extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
