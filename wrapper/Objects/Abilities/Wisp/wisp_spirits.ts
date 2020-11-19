import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("wisp_spirits")
export default class wisp_spirits extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("hit_radius")
	}
}
