import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("arc_warden_flux")
export class arc_warden_flux extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("search_radius", level)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}
}
