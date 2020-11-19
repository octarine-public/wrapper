import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("void_spirit_astral_step")
export default class void_spirit_astral_step extends Ability {
	public get CastRange(): number {
		return this.GetSpecialValue("max_travel_distance")
	}
	public get Speed(): number {
		return Number.MAX_SAFE_INTEGER
	}
}
