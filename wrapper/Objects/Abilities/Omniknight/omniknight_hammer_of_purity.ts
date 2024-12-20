import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("omniknight_hammer_of_purity")
export class omniknight_hammer_of_purity extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
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
		const attackDamage = owner.GetAttackDamage(target)
		return !this.IsAutoCastEnabled
			? attackDamage + super.GetDamage(target)
			: attackDamage
	}
}
