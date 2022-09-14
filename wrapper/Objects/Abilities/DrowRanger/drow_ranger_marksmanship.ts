import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("drow_ranger_marksmanship")
export class drow_ranger_marksmanship extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("disable_range", level)
	}
}
