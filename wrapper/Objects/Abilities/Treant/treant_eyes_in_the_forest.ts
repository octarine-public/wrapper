import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("treant_eyes_in_the_forest")
export class treant_eyes_in_the_forest extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("vision_aoe", level)
	}
}
