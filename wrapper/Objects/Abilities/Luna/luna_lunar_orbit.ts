import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("luna_lunar_orbit")
export class luna_lunar_orbit extends Ability implements IBuff, IShield {
	public readonly BuffModifierName = "modifier_luna_moon_glaive_shield"
	public readonly ShieldModifierName = this.BuffModifierName

	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		const rotating = this.GetSpecialValue("rotating_glaives_movement_radius", level)
		return rotating + this.GetSpecialValue("rotating_glaives_hit_radius", level)
	}
}
