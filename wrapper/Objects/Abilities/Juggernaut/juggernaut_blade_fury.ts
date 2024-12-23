import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("juggernaut_blade_fury")
export class juggernaut_blade_fury extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("blade_fury_radius", level)
	}
}
