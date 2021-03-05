import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("monkey_king_primal_spring")
export default class monkey_king_primal_spring extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("impact_radius", level)
	}
}
