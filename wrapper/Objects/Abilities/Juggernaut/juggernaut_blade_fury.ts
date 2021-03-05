import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("juggernaut_blade_fury")
export default class juggernaut_blade_fury extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("blade_fury_radius", level)
	}
}
