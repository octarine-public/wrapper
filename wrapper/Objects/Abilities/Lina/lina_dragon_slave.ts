import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lina_dragon_slave")
export class lina_dragon_slave extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("dragon_slave_width_end")
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
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("dragon_slave_damage", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("dragon_slave_distance", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("dragon_slave_speed", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetCastRangeForLevel(level: number): number {
		return this.GetBaseCastRangeForLevel(level) + this.GetBaseAOERadiusForLevel(level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("dragon_slave_width_initial", level)
	}
}
