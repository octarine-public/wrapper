import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("storm_spirit_static_remnant")
export default class storm_spirit_static_remnant extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("static_remnant_radius")
	}
}
