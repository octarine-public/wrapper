import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("queenofpain_sonic_wave")
export default class queenofpain_sonic_wave extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("final_aoe")
	}

	public get AOERadius(): number {
		return this.GetSpecialValue("starting_aoe")
	}

	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
