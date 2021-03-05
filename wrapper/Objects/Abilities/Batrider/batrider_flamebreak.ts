import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("batrider_flamebreak")
export default class batrider_flamebreak extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("explosion_radius", level)
	}
}
