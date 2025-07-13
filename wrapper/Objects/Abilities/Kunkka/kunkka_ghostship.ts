import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("kunkka_ghostship")
export class kunkka_ghostship extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("ghostship_width", level)
	}
	public GetBaseSpeedForLevel(_level: number): number {
		return this.GetSpecialValue("ghostship_speed", _level)
	}
}
