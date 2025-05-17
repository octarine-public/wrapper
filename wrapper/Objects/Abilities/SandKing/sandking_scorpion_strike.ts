import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("sandking_scorpion_strike")
export class sandking_scorpion_strike extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("attack_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		let attackDamage = owner.GetRawAttackDamage(target)
		const distance2D = owner
			.InFront(this.AOERadius - target.HullRadius)
			.Distance2D(target.Position)
		if (distance2D <= this.GetSpecialValue("inner_radius")) {
			const innerMulDamage = this.GetSpecialValue("inner_radius_bonus_damage_pct")
			attackDamage *= 1 + innerMulDamage / 100
		}
		return super.GetRawDamage(target) + attackDamage
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		return owner.GetAttackDamage(
			target,
			ATTACK_DAMAGE_STRENGTH.DAMAGE_MIN,
			this.GetRawDamage(target)
		)
	}
}
