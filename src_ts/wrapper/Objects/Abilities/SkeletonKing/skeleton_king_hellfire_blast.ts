import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("skeleton_king_hellfire_blast")
export default class skeleton_king_hellfire_blast extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("blast_speed")
	}
}
