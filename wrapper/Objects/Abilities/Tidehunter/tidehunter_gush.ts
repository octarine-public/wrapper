import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tidehunter_gush")
export class tidehunter_gush extends Ability implements INuke {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(_level: number): number {
		return this.GetSpecialValue("aoe_scepter")
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("gush_damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return (
			this.GetSpecialValue("speed_scepter") ||
			this.GetSpecialValue("projectile_speed", level)
		)
	}
}
