import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("enchantress_impetus")
export class enchantress_impetus extends Ability {
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const distanceDamage = this.GetSpecialValue("distance_damage_pct"),
			distanceCap = this.GetSpecialValue("distance_cap"),
			distance2D = Math.min(owner.Distance2D(target), distanceCap)

		let damage = (distance2D * distanceDamage) / 100
		if (target.IsCreep || target.IsIllusion) {
			damage *= this.GetSpecialValue("creep_multiplier")
		}
		return damage
	}

	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		if (this.IsAutoCastEnabled && this.IsReady) {
			return owner.GetAttackDamage(target)
		}
		return super.GetDamage(target) + owner.GetAttackDamage(target)
	}
}
