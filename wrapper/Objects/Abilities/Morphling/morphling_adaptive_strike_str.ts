import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("morphling_adaptive_strike_str")
export default class morphling_adaptive_strike_str extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public get ProjectileName() {
		return ["particles/units/heroes/hero_morphling/morphling_adaptive_strike_str_proj.vpcf"]
	}
}
