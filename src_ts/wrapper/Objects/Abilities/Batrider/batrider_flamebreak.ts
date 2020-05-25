import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("batrider_flamebreak")
export default class batrider_flamebreak extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("explosion_radius")
	}
}
