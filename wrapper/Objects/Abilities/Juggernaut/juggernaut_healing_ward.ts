import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("juggernaut_healing_ward")
export default class juggernaut_healing_ward extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("healing_ward_aura_radius", level)
	}
}
