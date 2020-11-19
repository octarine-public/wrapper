import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("lion_finger_of_death")
export default class lion_finger_of_death extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("splash_radius_scepter")
	}
}
