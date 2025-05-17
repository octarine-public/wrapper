import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("ember_spirit_sleight_of_fist")
export class ember_spirit_sleight_of_fist extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		let rawAttack = owner.GetRawAttackDamage(target)
		if (target.IsHero) {
			rawAttack += this.GetSpecialValue("bonus_hero_damage")
		}
		return rawAttack
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
