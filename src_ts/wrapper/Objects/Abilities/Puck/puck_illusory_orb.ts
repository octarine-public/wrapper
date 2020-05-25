import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("puck_illusory_orb")
export default class puck_illusory_orb extends Ability {
	public get BaseCastRange(): number {
		return this.GetSpecialValue("max_distance")
	}

	public get Speed(): number {
		return this.GetSpecialValue("orb_speed")
	}
}
