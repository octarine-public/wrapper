import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("magnataur_shockwave")
export class magnataur_shockwave extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("shock_speed")
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("shock_speed", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("shock_width", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}
}
