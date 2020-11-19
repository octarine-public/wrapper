import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("pudge_rot")
export default class pudge_rot extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("rot_radius")
	}
}
