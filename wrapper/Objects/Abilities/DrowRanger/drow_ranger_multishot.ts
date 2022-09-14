import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("drow_ranger_multishot")
export class drow_ranger_multishot extends Ability {
	// public GetCastRangeForLevel(level: number): number {
	// 	return (this.Owner?.AttackRange ?? 0) * this.GetSpecialValue("arrow_range_multiplier", level)
	// }
}
