import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("sven_great_cleave")
export default class sven_great_cleave extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("cleave_distance")
	}
}
