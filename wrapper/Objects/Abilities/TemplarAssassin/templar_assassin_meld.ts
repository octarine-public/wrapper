import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("templar_assassin_meld")
export class templar_assassin_meld extends Ability {
	public get IsInvisibility(): boolean {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("bonus_damage", level)
	}
	public GetBaseSpeedForLevel(_level: number): number {
		return this.Owner?.BaseAttackProjectileSpeed ?? 0
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		let bonusDamage = 0
		if (!target.IsBuilding) {
			bonusDamage += this.GetSpecialValue("bonus_damage")
		}
		return owner.GetRawAttackDamage(target) + bonusDamage
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		let predictiveArmor = 0
		if (
			!target.IsBuilding &&
			!owner.HasBuffByName("modifier_templar_assassin_meld")
		) {
			predictiveArmor = this.GetSpecialValue("bonus_armor")
		}
		return owner.GetAttackDamage(
			target,
			ATTACK_DAMAGE_STRENGTH.DAMAGE_MIN,
			this.GetRawDamage(target),
			owner.AttackDamageType(target),
			predictiveArmor
		)
	}
}
