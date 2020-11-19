import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("monkey_king_primal_spring")
export default class monkey_king_primal_spring extends Ability {
	public get AOERadius() {
		return this.GetSpecialValue("impact_radius")
	}
}
