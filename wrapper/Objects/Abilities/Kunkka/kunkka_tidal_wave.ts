import { WrapperClass } from "../../../Decorators"
import { ESkillShotType } from "../../../Enums/ESkillShotType"
import { Ability } from "../../Base/Ability"

@WrapperClass("kunkka_tidal_wave")
export class kunkka_tidal_wave extends Ability {
	public get PredictionSkillShotType(): ESkillShotType {
		return ESkillShotType.Line
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
