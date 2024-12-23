import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("juggernaut_omni_slash")
export class juggernaut_omni_slash extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("omni_slash_radius", level)
	}
}
