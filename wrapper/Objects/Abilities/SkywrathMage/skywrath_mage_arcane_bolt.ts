import { WrapperClass } from "../../../Decorators"
import { SPELL_IMMUNITY_TYPES } from "../../../Enums/SPELL_IMMUNITY_TYPES"
import { Ability } from "../../Base/Ability"

@WrapperClass("skywrath_mage_arcane_bolt")
export class skywrath_mage_arcane_bolt extends Ability {
	public get AbilityDamage(): number {
		let damage = super.AbilityDamage
		if (this.Owner !== undefined) {
			damage += this.Owner.TotalIntellect * this.GetSpecialValue("int_multiplier")
		}
		return damage
	}

	public get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		const talent = this.Owner?.GetAbilityByName("special_bonus_unique_skywrath_6")
		if (talent === undefined || talent.Level === 0) {
			return super.AbilityImmunityType
		}

		return SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("bolt_damage", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("bolt_speed", level)
	}
}
