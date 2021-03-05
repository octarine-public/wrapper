import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("sandking_sand_storm")
export default class sandking_sand_storm extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("sand_storm_radius", level)
	}
}
