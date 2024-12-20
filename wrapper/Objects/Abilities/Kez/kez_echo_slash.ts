import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("kez_echo_slash")
export class kez_echo_slash extends Ability {
	public get TravelDistance(): number {
		return this.GetSpecialValue("travel_distance")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("katana_radius", level)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("katana_distance", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		let damageBonus = 0
		if (target.IsHero) {
			damageBonus += this.GetSpecialValue("echo_hero_damage")
		}
		const attackDamage = owner.GetRawAttackDamage(target)
		const multiplier = this.GetSpecialValue("katana_echo_damage")
		return damageBonus + (attackDamage * multiplier) / 100
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
