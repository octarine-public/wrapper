import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tidehunter_gush")
export class tidehunter_gush extends Ability {
	public get AOERadius(): number {
		return !this.Owner?.HasScepter
			? super.AOERadius
			: this.GetSpecialValue("aoe_scepter")
	}
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public get Speed(): number {
		return !this.Owner?.HasScepter
			? super.Speed
			: this.GetSpecialValue("speed_scepter")
	}

	public GetBaseAOERadiusForLevel(_level: number): number {
		return 0
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("gush_damage", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
}
