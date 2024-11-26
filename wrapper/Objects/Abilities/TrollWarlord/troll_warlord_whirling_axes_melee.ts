import { WrapperClass } from "../../../Decorators"
import { SPELL_IMMUNITY_TYPES } from "../../../Enums/SPELL_IMMUNITY_TYPES"
import { Ability } from "../../Base/Ability"

@WrapperClass("troll_warlord_whirling_axes_melee")
export class troll_warlord_whirling_axes_melee extends Ability {
	public get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		return this.GetSpecialValue("pierces_magic_immunity") !== 0
			? SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
			: super.AbilityImmunityType
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("max_range", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("axe_movement_speed", level)
	}
}
