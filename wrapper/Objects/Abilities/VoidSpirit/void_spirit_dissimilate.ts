import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("void_spirit_dissimilate")
export default class void_spirit_dissimilate extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("first_ring_distance_offset") * 1.5
	}
}
