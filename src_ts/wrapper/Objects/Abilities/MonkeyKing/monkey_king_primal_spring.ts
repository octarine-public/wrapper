import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("monkey_king_primal_spring")
export default class monkey_king_primal_spring extends Ability {
	public get AOERadius() {
		return this.GetSpecialValue("impact_radius")
	}
}
