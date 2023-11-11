import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("twin_gate_portal_warp")
export class twin_gate_portal_warp extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
