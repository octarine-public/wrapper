import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("mirana_arrow")
export default class mirana_arrow extends Ability {
	public get AOERadius() {
		return this.GetSpecialValue("arrow_width")
	}
	public get Speed() {
		return this.GetSpecialValue("arrow_speed")
	}
}
