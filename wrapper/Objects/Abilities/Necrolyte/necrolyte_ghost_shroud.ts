import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("necrolyte_ghost_shroud")
export class necrolyte_ghost_shroud extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("slow_aoe", level)
	}
}
