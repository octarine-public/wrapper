import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { modifier_tiny_tree_grab } from "../../../Objects/Modifiers/Abilities/Tiny/modifier_tiny_tree_grab"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("tiny_toss_tree")
export class tiny_toss_tree extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const modifier = owner.GetBuffByClass(modifier_tiny_tree_grab)
		if (modifier === undefined || modifier.CachedDamage === 0) {
			return 0
		}
		const bonusDamage = this.GetSpecialValue("bonus_damage"),
			attackDamage = owner.GetRawAttackDamage(target)
		return attackDamage - modifier.CachedDamage + bonusDamage
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
