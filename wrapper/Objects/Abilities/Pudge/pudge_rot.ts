import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("pudge_rot")
export default class pudge_rot extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("rot_radius")
	}
}
