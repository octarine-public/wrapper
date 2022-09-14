import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dark_willow_cursed_crown")
export class dark_willow_cursed_crown extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("stun_radius", level)
	}
}
