import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("elder_titan_earth_splitter")
export class elder_titan_earth_splitter extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("crack_width", level)
	}
}
