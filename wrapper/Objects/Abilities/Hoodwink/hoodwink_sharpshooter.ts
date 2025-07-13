import { WrapperClass } from "../../../Decorators"
import { SPELL_IMMUNITY_TYPES } from "../../../Enums/SPELL_IMMUNITY_TYPES"
import { modifier_hoodwink_sharpshooter_windup } from "../../../Objects/Modifiers/Abilities/Hoodwink/modifier_hoodwink_sharpshooter_windup"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("hoodwink_sharpshooter")
export class hoodwink_sharpshooter extends Ability implements INuke {
	public get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		const owner = this.Owner
		if (owner === undefined) {
			return super.AbilityImmunityType
		}
		const talent = owner.GetAbilityByName(
			"special_bonus_unique_hoodwink_sharpshooter_pure_damage"
		)
		if (talent === undefined || talent.Level === 0) {
			return super.AbilityImmunityType
		}
		return SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("arrow_width", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("arrow_speed", level)
	}
	public GetRawDamage(_target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const modifierDamage = this.modifierDamage(owner),
			basePower = this.GetSpecialValue("base_power") * 100
		return modifierDamage || (this.GetSpecialValue("max_damage") * basePower) / 100
	}
	private modifierDamage(owner: Unit): number {
		const modifier = owner.GetBuffByClass(modifier_hoodwink_sharpshooter_windup)
		return modifier?.RemainingDamage ?? 0
	}
}
