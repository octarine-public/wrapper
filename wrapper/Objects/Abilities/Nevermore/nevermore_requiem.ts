import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("nevermore_requiem")
export class nevermore_requiem extends Ability {
	public get Speed() {
		return this.GetSpecialValue("requiem_line_speed")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("requiem_radius", level) +
			this.GetSpecialValue("requiem_line_width_start", level) +
			this.GetSpecialValue("requiem_line_width_end", level)
	}
}
