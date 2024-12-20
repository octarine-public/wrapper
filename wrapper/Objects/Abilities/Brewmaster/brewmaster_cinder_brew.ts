import { WrapperClass } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"

@WrapperClass("brewmaster_cinder_brew")
export class brewmaster_cinder_brew extends Ability {
	public get DamageType(): DAMAGE_TYPES {
		const hasGetBaseDamageForLevel = this.GetBaseDamageForLevel(this.Level) !== 0
		return hasGetBaseDamageForLevel
			? DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
			: super.DamageType
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("barrel_impact_damage", level)
	}
}
