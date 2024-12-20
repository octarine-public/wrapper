import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("mars_gods_rebuke")
export class mars_gods_rebuke extends Ability {
	protected readonly IsSpellAmplify = false

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const mul = this.GetSpecialValue("crit_mult") / 100
		let damage = owner.GetRawAttackDamage(target, mul)
		if (target.IsHero) {
			damage += this.GetSpecialValue("bonus_damage_vs_heroes")
		}
		return damage
	}
}
