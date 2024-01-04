import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("necrolyte_reapers_scythe")
export class necrolyte_reapers_scythe extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}
}
