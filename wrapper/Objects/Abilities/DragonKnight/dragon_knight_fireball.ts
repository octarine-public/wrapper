import { WrapperClass } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"

@WrapperClass("dragon_knight_fireball")
export class dragon_knight_fireball extends Ability {
	public get DamageType(): DAMAGE_TYPES {
		return this.HeroFacetKey === 1
			? DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
			: super.DamageType
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return (this.Owner?.HasBuffByName("modifier_dragon_knight_dragon_form") ?? false)
			? this.GetSpecialValue("dragon_form_cast_range", level)
			: this.GetSpecialValue("melee_cast_range", level)
	}
}
