import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("crystal_maiden_freezing_field")
export class crystal_maiden_freezing_field extends Ability {
	public ExplosionRadius(): number {
		return this.GetSpecialValue("explosion_radius")
	}
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
	public GetBaseCastPointForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastPoint", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("AbilityDuration", level)
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
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseManaCostForLevel(level: number): number {
		return this.GetSpecialValue("AbilityManaCost", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseChannelTimeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityChannelTime", level)
	}
}
