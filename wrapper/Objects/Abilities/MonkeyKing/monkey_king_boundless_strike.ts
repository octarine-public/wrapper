import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("monkey_king_boundless_strike")
export class monkey_king_boundless_strike extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("strike_radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("strike_flat_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const baseDamage = super.GetRawDamage(target),
			damageValueType = ATTACK_DAMAGE_STRENGTH.DAMAGE_MIN,
			critMul = this.GetSpecialValue("strike_crit_mult") / 100
		return baseDamage + owner.GetRawAttackDamage(target, damageValueType, critMul)
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
