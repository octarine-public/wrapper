import { WrapperClass } from "../../../Decorators"
import { SPELL_IMMUNITY_TYPES } from "../../../Enums/SPELL_IMMUNITY_TYPES"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("skywrath_mage_arcane_bolt")
export class skywrath_mage_arcane_bolt extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		const talent = this.Owner?.GetAbilityByName("special_bonus_unique_skywrath_6")
		if (talent === undefined || talent.Level === 0) {
			return super.AbilityImmunityType
		}
		return SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("bolt_damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("bolt_speed", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		const baseDamage = super.GetRawDamage(target)
		if (owner === undefined || baseDamage === 0) {
			return baseDamage
		}
		const multiplier = this.GetSpecialValue("int_multiplier")
		return baseDamage + owner.TotalIntellect * multiplier
	}
}
