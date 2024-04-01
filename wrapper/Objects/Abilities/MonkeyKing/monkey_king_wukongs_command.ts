import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("monkey_king_wukongs_command")
export class monkey_king_wukongs_command extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("second_radius", level)
	}

	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("cast_range", level)
	}
}
