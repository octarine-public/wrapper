import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("omniknight_hammer_of_purity")
export class omniknight_hammer_of_purity extends Ability implements INuke {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public get CastRange(): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		// NOTE: depend with modifier_omniknight_hammer_of_purity
		// MODIFIER_PROPERTY_ATTACK_RANGE_BONUS
		let range = owner.GetAttackRange()
		if (!this.IsAutoCastEnabled && this.IsReady) {
			range += this.GetSpecialValue("attack_range_bonus")
		}
		return range
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("bonus_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner,
			baseDamage = super.GetRawDamage(target)
		if (baseDamage === 0 || owner === undefined || this.Level === 0) {
			return baseDamage
		}
		const shareDamage = this.GetSpecialValue("base_damage")
		return baseDamage + (owner.AttackDamageMin * shareDamage) / 100
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		// NOTE: depend with modifier_omniknight_hammer_of_purity
		// MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE
		const attackDamage = owner.GetAttackDamage(target)
		return !this.IsAutoCastEnabled
			? attackDamage + super.GetDamage(target)
			: attackDamage
	}
}
