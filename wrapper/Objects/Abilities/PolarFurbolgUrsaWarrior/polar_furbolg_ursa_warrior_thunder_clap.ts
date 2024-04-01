import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("polar_furbolg_ursa_warrior_thunder_clap")
export class polar_furbolg_ursa_warrior_thunder_clap extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
