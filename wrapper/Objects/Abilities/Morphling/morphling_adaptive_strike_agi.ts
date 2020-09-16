import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("morphling_adaptive_strike_agi")
export default class morphling_adaptive_strike_agi extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
