import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("jakiro_macropyre")
export class jakiro_macropyre extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		if (this.Owner?.HasScepter)
			return this.GetSpecialValue("cast_range_scepter", level)
		return super.GetBaseCastRangeForLevel(level)
	}
}
