import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("sven_storm_bolt")
export class sven_storm_bolt extends Ability {
	public get CastRange(): number {
		return this.GetSpecialValue("cast_range_bonus_scepter") + super.CastRange
	}
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("bolt_aoe", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("bolt_speed", level)
	}
	public GetRawDamage(target: Unit): number {
		let baseDamage = super.GetRawDamage(target)
		if (this.AltCastState) {
			baseDamage += this.GetSpecialValue("scepter_bonus_damage")
		}
		return baseDamage
	}
}
