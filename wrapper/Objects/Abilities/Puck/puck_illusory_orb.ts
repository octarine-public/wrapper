import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("puck_illusory_orb")
export class puck_illusory_orb extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("max_distance", level)
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
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("orb_speed", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
