import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("jakiro_ice_path")
export default class jakiro_ice_path extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("path_radius", level)
	}
}
