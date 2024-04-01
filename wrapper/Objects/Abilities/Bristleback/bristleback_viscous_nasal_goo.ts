import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bristleback_viscous_nasal_goo")
export class bristleback_viscous_nasal_goo extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("goo_speed", level)
	}
}
