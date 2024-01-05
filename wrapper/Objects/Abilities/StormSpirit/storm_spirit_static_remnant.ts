import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("storm_spirit_static_remnant")
export class storm_spirit_static_remnant extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("static_remnant_radius", level)
	}
}
