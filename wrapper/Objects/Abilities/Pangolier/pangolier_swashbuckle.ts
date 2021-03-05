import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("pangolier_swashbuckle")
export default class pangolier_swashbuckle extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("dash_speed")
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("dash_range", level)
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("start_radius", level)
	}
}
