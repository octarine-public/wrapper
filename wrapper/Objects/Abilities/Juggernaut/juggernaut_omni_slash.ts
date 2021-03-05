import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("juggernaut_omni_slash")
export default class juggernaut_omni_slash extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("omni_slash_radius", level)
	}
}
