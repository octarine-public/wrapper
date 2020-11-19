import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("mars_spear")
export default class mars_spear extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("spear_width")
	}
	public get Speed(): number {
		return this.GetSpecialValue("spear_speed")
	}
}
