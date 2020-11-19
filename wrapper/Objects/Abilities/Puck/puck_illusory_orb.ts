import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("puck_illusory_orb")
export default class puck_illusory_orb extends Ability {
	public get BaseCastRange(): number {
		return this.GetSpecialValue("max_distance")
	}

	public get Speed(): number {
		return this.GetSpecialValue("orb_speed")
	}
}
