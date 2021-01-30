import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("sandking_sand_storm")
export default class sandking_sand_storm extends Ability {
	public get AOERadius() {
		return this.GetSpecialValue("sand_storm_radius")
	}
}
