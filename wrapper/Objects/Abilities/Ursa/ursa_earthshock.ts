import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ursa_earthshock")
export class ursa_earthshock extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("shock_radius", level)
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
	public GetChargeRestoreTimeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityChargeRestoreTime", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetMaxChargesForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCharges", level)
	}
}
