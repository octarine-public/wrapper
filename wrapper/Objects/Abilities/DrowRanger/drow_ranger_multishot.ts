import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_drow_ranger_frost_arrows } from "../../Modifiers/Abilities/DrowRanger/modifier_drow_ranger_frost_arrows"

@WrapperClass("drow_ranger_multishot")
export class drow_ranger_multishot extends Ability {
	// public GetCastRangeForLevel(level: number): number {
	// 	return (this.Owner?.AttackRange ?? 0) * this.GetSpecialValue("arrow_range_multiplier", level)
	// }
	public get DamageBlockType() {
		return DAMAGE_TYPES.DAMAGE_TYPE_NONE
	}
	public GetRawDamage(_target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const bonusDamage = this.frostArrowBonusDamage(owner),
			baseDamage = owner.GetAttackDamageBase(ATTACK_DAMAGE_STRENGTH.DAMAGE_AVG),
			shareDamage = this.GetSpecialValue("arrow_damage_pct")
		return ((baseDamage + bonusDamage) * shareDamage) / 100
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || target.IsAvoidTotalDamage) {
			return 0
		}
		const damageType = this.DamageType
		if (target.IsAbsoluteNoDamage(damageType)) {
			return 0
		}
		const rawDamage = this.GetRawDamage(target),
			rawDamageBlock = target.GetDamageBlock(rawDamage, damageType, true),
			calculateRawDmg = rawDamage * this.SpellAmplify - rawDamageBlock,
			damageAmp = target.GetDamageAmplification(owner, damageType, 0, false, true)
		const totalDamage = calculateRawDmg * target.EffSpellAmpTarget * damageAmp
		return Math.max(totalDamage - target.GetDamageBlock(totalDamage, damageType), 0)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("arrow_speed", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("arrow_width", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("arrow_damage_pct", level)
	}
	private frostArrowBonusDamage(owner: Unit): number {
		const modifier = owner.GetBuffByClass(modifier_drow_ranger_frost_arrows)
		return modifier?.CachedDamage ?? 0
	}
}
