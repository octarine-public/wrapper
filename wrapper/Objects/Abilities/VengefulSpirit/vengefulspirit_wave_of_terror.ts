import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("vengefulspirit_wave_of_terror")
export default class vengefulspirit_wave_of_terror extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("wave_speed")
	}
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("wave_width", level)
	}
}
