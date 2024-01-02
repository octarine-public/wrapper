import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dazzle_shadow_wave")
export class dazzle_shadow_wave extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("damage_radius", level)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}
}
