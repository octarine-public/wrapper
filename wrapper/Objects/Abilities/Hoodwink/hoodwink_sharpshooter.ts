import { WrapperClass } from "../../../Decorators"
import { SPELL_IMMUNITY_TYPES } from "../../../Enums/SPELL_IMMUNITY_TYPES"
import { Ability } from "../../Base/Ability"

@WrapperClass("hoodwink_sharpshooter")
export class hoodwink_sharpshooter extends Ability {
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
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("arrow_width", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("arrow_speed", level)
	}
}
