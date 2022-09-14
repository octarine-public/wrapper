import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sandking_burrowstrike")
export class sandking_burrowstrike extends Ability {
	public get Speed(): number {
		if (this.Owner?.HasScepter)
			return this.GetSpecialValue("burrow_speed_scepter")
		return this.GetSpecialValue("burrow_speed")
	}
	public GetBaseCastRangeForLevel(level: number): number {
		if (this.Owner?.HasScepter)
			return this.GetSpecialValue("cast_range_scepter", level)
		return super.GetBaseCastRangeForLevel(level)
	}
}
