import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("pudge_meat_hook")
export default class pudge_meat_hook extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("hook_width")
	}

	public get Speed(): number {
		return this.GetSpecialValue("hook_speed")
	}
}
