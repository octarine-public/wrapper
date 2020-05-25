import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("pangolier_swashbuckle")
export default class pangolier_swashbuckle extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("start_radius")
	}
	public get Speed(): number {
		return this.GetSpecialValue("dash_speed")
	}
	public get BaseCastRange(): number {
		return this.GetSpecialValue("dash_range")
	}
}
