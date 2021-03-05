import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("sven_great_cleave")
export default class sven_great_cleave extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("cleave_distance", level)
	}
}
