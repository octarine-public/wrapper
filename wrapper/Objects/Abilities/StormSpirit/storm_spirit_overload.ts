import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("storm_spirit_overload")
export class storm_spirit_overload extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("overload_aoe", level)
	}
}
