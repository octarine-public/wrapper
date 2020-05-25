import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("jakiro_ice_path")
export default class jakiro_ice_path extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("path_radius")
	}
}
