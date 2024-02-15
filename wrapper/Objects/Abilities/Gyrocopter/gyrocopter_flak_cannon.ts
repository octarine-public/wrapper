import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("gyrocopter_flak_cannon")
export class gyrocopter_flak_cannon extends Ability {
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
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
}
