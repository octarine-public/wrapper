import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sniper_assassinate")
export class sniper_assassinate extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetBaseCastPointForLevel(level: number): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("scepter_cast_point", level)
			: this.AbilityData.GetCastPoint(level)
	}
}
