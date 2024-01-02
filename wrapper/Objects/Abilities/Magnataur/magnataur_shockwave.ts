import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("magnataur_shockwave")
export class magnataur_shockwave extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("shock_speed")
	}
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("shock_width", level)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}
}
