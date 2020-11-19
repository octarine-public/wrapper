import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("dark_willow_terrorize")
export default class dark_willow_terrorize extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("destination_radius")
	}
}
