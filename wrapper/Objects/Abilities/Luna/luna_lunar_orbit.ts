import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("luna_lunar_orbit")
export class luna_lunar_orbit extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		const rotating = this.GetSpecialValue("rotating_glaives_movement_radius", level)
		return rotating + this.GetSpecialValue("rotating_glaives_hit_radius", level)
	}
}
