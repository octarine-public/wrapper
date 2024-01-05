import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tinker_laser")
export class tinker_laser extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("laser_damage")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		if (this.Owner?.HasScepter) {
			return this.GetSpecialValue("scepter_bounce_range", level)
		}
		return 0
	}
	public GetCastRangeForLevel(level: number): number {
		return super.GetCastRangeForLevel(level) + this.GetBaseAOERadiusForLevel(level)
	}
}
