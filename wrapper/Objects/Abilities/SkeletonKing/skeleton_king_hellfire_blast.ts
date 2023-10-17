import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("skeleton_king_hellfire_blast")
export class skeleton_king_hellfire_blast extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("blast_speed")
	}
}
