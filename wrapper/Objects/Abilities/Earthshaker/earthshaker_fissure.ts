import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("earthshaker_fissure")
export class earthshaker_fissure extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("fissure_radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("fissure_damage", level)
	}
}
