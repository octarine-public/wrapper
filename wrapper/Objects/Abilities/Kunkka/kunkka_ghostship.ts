import { WrapperClass } from "../../../Decorators"
import { ESkillShotType } from "../../../Enums/ESkillShotType"
import { Ability } from "../../Base/Ability"

@WrapperClass("kunkka_ghostship")
export class kunkka_ghostship extends Ability {
	public get PredictionSkillShotType(): ESkillShotType {
		return ESkillShotType.Line
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("ghostship_width", level)
	}
	public GetBaseSpeedForLevel(_level: number): number {
		return this.GetSpecialValue("ghostship_speed", _level)
	}
}
