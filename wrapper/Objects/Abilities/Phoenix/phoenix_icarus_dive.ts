import { WrapperClass } from "../../../Decorators"
import { ESkillShotType } from "../../../Enums/ESkillShotType"
import { Ability } from "../../Base/Ability"

@WrapperClass("phoenix_icarus_dive")
export class phoenix_icarus_dive extends Ability {
	public get PredictionSkillShotType(): ESkillShotType {
		return ESkillShotType.Arc
	}
	public get Speed(): number {
		return this.CastRange / this.GetSpecialValue("dive_duration")
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("dash_length", level)
	}
}
