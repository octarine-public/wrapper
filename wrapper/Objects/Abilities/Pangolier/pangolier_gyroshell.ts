import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("pangolier_gyroshell")
export default class pangolier_gyroshell extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("hit_radius")
	}
	public get Speed(): number {
		return this.GetSpecialValue("forward_move_speed")
	}
}
