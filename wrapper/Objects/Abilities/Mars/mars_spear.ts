import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("mars_spear")
export class mars_spear extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("spear_speed")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("spear_width", level)
	}
}
