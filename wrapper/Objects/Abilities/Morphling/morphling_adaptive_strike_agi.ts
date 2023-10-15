import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("morphling_adaptive_strike_agi")
export class morphling_adaptive_strike_agi extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
