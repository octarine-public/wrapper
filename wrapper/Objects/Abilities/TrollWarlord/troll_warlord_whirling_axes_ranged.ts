import { WrapperClass } from "../../../Decorators"
import { SPELL_IMMUNITY_TYPES } from "../../../Enums/SPELL_IMMUNITY_TYPES"
import { Ability } from "../../Base/Ability"

@WrapperClass("troll_warlord_whirling_axes_ranged")
export class troll_warlord_whirling_axes_ranged extends Ability implements INuke {
	public get EndRadius(): number {
		return 206.17 // noе in special data
	}
	public get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		return this.GetSpecialValue("pierces_magic_immunity") !== 0
			? SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
			: super.AbilityImmunityType
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("axe_range", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("axe_speed", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("axe_width", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("axe_damage", level)
	}
}
