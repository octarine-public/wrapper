import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("muerta_ofrenda")
export class muerta_ofrenda extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("effect_radius", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("pierce_the_veil_duration_pct", level)
	}
}
