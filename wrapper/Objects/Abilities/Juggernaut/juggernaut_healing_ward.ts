import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("juggernaut_healing_ward")
export class juggernaut_healing_ward extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("healing_ward_aura_radius", level)
	}
}
