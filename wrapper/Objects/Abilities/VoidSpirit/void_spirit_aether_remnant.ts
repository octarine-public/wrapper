import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("void_spirit_aether_remnant")
export class void_spirit_aether_remnant extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public get ActivationDelay(): number {
		return this.GetSpecialValue("activation_delay")
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
