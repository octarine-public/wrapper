import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("morphling_adaptive_strike_str")
export class morphling_adaptive_strike_str extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_morphling/morphling_adaptive_strike_str_proj.vpcf"
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
