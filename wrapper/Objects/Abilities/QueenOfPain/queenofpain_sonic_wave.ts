import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("queenofpain_sonic_wave")
export default class queenofpain_sonic_wave extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("final_aoe")
	}
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("starting_aoe", level)
	}
}
