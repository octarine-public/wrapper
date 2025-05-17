import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_bounty_hunter_jinada } from "../../Modifiers/Abilities/BountyHunter/modifier_bounty_hunter_jinada"

@WrapperClass("bounty_hunter_shuriken_toss")
export class bounty_hunter_shuriken_toss extends Ability implements INuke {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetDamage(target: Unit): number {
		return super.GetDamage(target) + this.bonusDamage(target)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("bonus_damage", level)
	}
	private bonusDamage(target: Unit): number {
		const owner = this.Owner
		if (!this.OwnerHasScepter || owner === undefined || target.IsAvoidTotalDamage) {
			return 0
		}
		const modifier = owner.GetBuffByClass(modifier_bounty_hunter_jinada)
		if (modifier === undefined || modifier.Ability === undefined) {
			return 0
		}
		const damageType = modifier.Ability.DamageType
		if (modifier.CachedDamage === 0 || target.IsAbsoluteNoDamage(damageType, owner)) {
			return 0
		}
		const damage = modifier.CachedDamage,
			rawDamageBlock = target.GetDamageBlock(damage, damageType, true),
			calculateRawDmg = damage * this.SpellAmplify - rawDamageBlock
		const damageCalc = calculateRawDmg - target.GetPassiveDamageBlock(damageType),
			damageAmp = target.GetDamageAmplification(owner, damageType)
		const totalDamage = damageCalc * target.EffSpellAmpTarget * damageAmp
		return Math.max(totalDamage - target.GetDamageBlock(totalDamage, damageType), 0)
	}
}
