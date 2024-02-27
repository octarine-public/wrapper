import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sniper_assassinate")
export class sniper_assassinate extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseCastPointForLevel(level: number): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("scepter_cast_point", level)
			: this.AbilityData.GetCastPoint(level)
	}
}
