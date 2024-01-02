import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("grimstroke_dark_artistry")
export class grimstroke_dark_artistry extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("end_radius")
	}
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("start_radius", level)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("abilitycastrange", level)
	}
}
