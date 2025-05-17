import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tinker_laser")
export class tinker_laser extends Ability implements INuke {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.OwnerHasScepter
			? this.GetSpecialValue("scepter_bounce_radius", level)
			: 0
	}
	public GetCastRangeForLevel(level: number): number {
		return super.GetCastRangeForLevel(level) + this.GetBaseAOERadiusForLevel(level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("laser_damage", level)
	}
}
