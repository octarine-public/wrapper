import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ursa_earthshock")
export class ursa_earthshock extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("shock_radius", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
}
