import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("void_spirit_dissimilate")
export default class void_spirit_dissimilate extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("first_ring_distance_offset") * 1.5
	}
}
