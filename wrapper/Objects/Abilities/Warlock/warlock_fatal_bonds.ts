import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("warlock_fatal_bonds")
export class warlock_fatal_bonds extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("search_aoe", level)
	}
}
