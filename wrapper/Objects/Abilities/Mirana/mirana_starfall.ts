import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("mirana_starfall")
export class mirana_starfall extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("starfall_radius", level)
	}
}
