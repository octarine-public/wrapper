import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("puck_dream_coil")
export class puck_dream_coil extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("coil_break_radius", level)
	}
}
