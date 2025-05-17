import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_innate_riki_backstab } from "../../Modifiers/Abilities/Riki/modifier_innate_riki_backstab"

@WrapperClass("riki_blink_strike")
export class riki_blink_strike extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("bonus_damage", level)
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const baseDamage = super.GetDamage(target),
			backStabDamage = this.backStabDamage(owner, target)
		if (baseDamage === 0 || backStabDamage === -1) {
			return baseDamage
		}
		if (backStabDamage !== 0) {
			return baseDamage + owner.GetAttackDamage(target)
		}
		const attackDamage = owner.GetAttackDamage(
			target,
			ATTACK_DAMAGE_STRENGTH.DAMAGE_MIN,
			owner.GetRawAttackDamage(target) + this.backStabDamage(owner, target, true)
		)
		return baseDamage + attackDamage
	}

	private backStabDamage(
		caster: Unit,
		target: Unit,
		withoutCalculation: boolean = false
	): number {
		const modifier = caster.GetBuffByClass(modifier_innate_riki_backstab)
		return modifier !== undefined
			? modifier.GetAttackBonusDamage(caster, target, withoutCalculation)
			: -1
	}
}
