import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tinker_laser")
export class tinker_laser extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("laser_damage")
	}
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("scepter_bounce_range", level)
			: 0
	}
	public GetCastRangeForLevel(level: number): number {
		return super.GetCastRangeForLevel(level) + this.GetBaseAOERadiusForLevel(level)
	}
}
