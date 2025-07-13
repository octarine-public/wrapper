import { WrapperClass } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { SPELL_IMMUNITY_TYPES } from "../../../Enums/SPELL_IMMUNITY_TYPES"
import { Ability } from "../../Base/Ability"

@WrapperClass("jakiro_macropyre")
export class jakiro_macropyre extends Ability {
	public get DamageType(): DAMAGE_TYPES {
		return this.OwnerHasScepter ? DAMAGE_TYPES.DAMAGE_TYPE_PURE : super.DamageType
	}
	public get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		return this.GetSpecialValue("pierces_magic_immunity") !== 0
			? SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
			: super.AbilityImmunityType
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("path_width", level)
	}
}
