import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("wisp_spirits")
export default class wisp_spirits extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("hit_radius")
	}
}
