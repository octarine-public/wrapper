import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("nevermore_requiem")
export default class nevermore_requiem extends Ability {
	public get AOERadius() {
		return this.GetSpecialValue("requiem_radius") +
			this.GetSpecialValue("requiem_line_width_start") +
			this.GetSpecialValue("requiem_line_width_end")
	}
	public get Speed() {
		return this.GetSpecialValue("requiem_line_speed")
	}
}
