import { WrapperClass } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"

@WrapperClass("brewmaster_cinder_brew")
export class brewmaster_cinder_brew extends Ability implements INuke {
	public get DamageType(): DAMAGE_TYPES {
		const hasGetBaseDamageForLevel = this.GetBaseDamageForLevel(this.Level) !== 0
		return hasGetBaseDamageForLevel
			? DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
			: super.DamageType
	}
	public IsNuke(): this is INuke {
		return this.GetBaseDamageForLevel(1) !== 0
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("barrel_impact_damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
}
