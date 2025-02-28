import { WrapperClass } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"

@WrapperClass("dragon_knight_dragon_tail")
export class dragon_knight_dragon_tail extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public get DamageType(): DAMAGE_TYPES {
		return this.HeroFacetKey === 1
			? DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
			: super.DamageType
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		const hasDragonForm = this.Owner?.HasBuffByName(
			"modifier_dragon_knight_dragon_form"
		)
		if (!hasDragonForm) {
			return super.GetBaseCastRangeForLevel(level)
		}
		return this.GetSpecialValue("dragon_cast_range", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("aoe_radius", level)
	}
}
