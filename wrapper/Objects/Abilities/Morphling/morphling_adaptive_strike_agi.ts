import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("morphling_adaptive_strike_agi")
export class morphling_adaptive_strike_agi extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage_base", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const str = owner.TotalStrength >> 0,
			agil = owner.TotalAgility >> 0,
			min = this.GetSpecialValue("damage_min"),
			max = this.GetSpecialValue("damage_max"),
			baseDamage = super.GetRawDamage(target)
		return baseDamage + agil * Math.remapRange(agil / str, 0.5, 1.5, min, max)
	}
}
