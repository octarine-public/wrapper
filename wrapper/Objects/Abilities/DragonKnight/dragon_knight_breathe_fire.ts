import { WrapperClass } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"

@WrapperClass("dragon_knight_breathe_fire")
export class dragon_knight_breathe_fire extends Ability implements INuke {
	public get DamageType(): DAMAGE_TYPES {
		return this.HeroFacetKey === 1
			? DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
			: super.DamageType
	}
	public get EndRadius(): number {
		return this.GetSpecialValue("end_radius")
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("start_radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
