import { WrapperClass } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("elder_titan_earth_splitter")
export class elder_titan_earth_splitter extends Ability {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("crack_width", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const multiplier = this.GetSpecialValue("damage_pct")
		return Math.floor((target.MaxHP * multiplier) / 100)
	}

	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || target.IsAvoidTotalDamage) {
			return 0
		}
		const damageType = this.DamageType
		if (target.IsAbsoluteNoDamage(damageType, owner)) {
			return 0
		}
		let rawDamageBlock = 0,
			totalDamageBlock = 0
		const rawDamage = this.GetRawDamage(target) / 2
		const rawBlockPhys = target.GetDamageBlock(
			rawDamage,
			DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
			true
		)
		const rawBlockMagic = target.GetDamageBlock(
			rawDamage,
			DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
			true
		)
		if (rawBlockPhys !== 0) {
			rawDamageBlock += rawBlockPhys
		}
		if (rawBlockMagic !== 0) {
			rawDamageBlock += rawBlockMagic
		}
		const calculateRawDmg = rawDamage * this.SpellAmplify - rawDamageBlock
		const damageAmpPhys = target.GetDamageAmplification(
			owner,
			DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
		)
		const damageAmpMagic = target.GetDamageAmplification(
			owner,
			DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
		)
		const magicDamage = calculateRawDmg * damageAmpMagic
		const physicalDamage = calculateRawDmg * damageAmpPhys

		const totalDamage = (physicalDamage + magicDamage) * target.EffSpellAmpTarget
		const blockPhys = target.GetDamageBlock(
			rawDamage,
			DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
			true
		)
		const blockMagic = target.GetDamageBlock(
			rawDamage,
			DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
			true
		)
		if (blockPhys !== 0) {
			totalDamageBlock += blockPhys
		}
		if (blockMagic !== 0) {
			totalDamageBlock += blockMagic
		}
		return Math.max(totalDamage - totalDamageBlock, 0)
	}
}
