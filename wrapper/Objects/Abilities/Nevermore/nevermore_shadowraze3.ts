import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("nevermore_shadowraze3")
export default class nevermore_shadowraze3 extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("shadowraze_range", level)
	}
	public GetCastRangeForLevel(level: number): number {
		return this.GetBaseCastRangeForLevel(level)
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("shadowraze_radius", level)
	}
}
