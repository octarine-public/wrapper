import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("mars_gods_rebuke")
export class mars_gods_rebuke extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const damageValueType = ATTACK_DAMAGE_STRENGTH.DAMAGE_MIN,
			critMul = this.GetSpecialValue("crit_mult") / 100
		let rawAttack = owner.GetRawAttackDamage(target, damageValueType, critMul)
		if (target.IsHero) {
			rawAttack += this.GetSpecialValue("bonus_damage_vs_heroes")
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
