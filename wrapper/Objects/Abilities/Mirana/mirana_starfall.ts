import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("mirana_starfall")
export default class mirana_starfall extends Ability {
	public get AOERadius() {
		return this.GetSpecialValue("starfall_radius")
	}
}
