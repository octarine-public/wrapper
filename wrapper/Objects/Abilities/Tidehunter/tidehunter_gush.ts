import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tidehunter_gush")
export class tidehunter_gush extends Ability {
	public get AOERadius(): number {
		return !this.Owner?.HasScepter
			? super.AOERadius
			: this.GetSpecialValue("scepter_radius")
	}
	public get Speed(): number {
		return !this.Owner?.HasScepter
			? super.Speed
			: this.GetSpecialValue("speed_scepter")
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(_level: number): number {
		return 0
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("gush_damage", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
}
