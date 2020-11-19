import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("treant_eyes_in_the_forest")
export default class treant_eyes_in_the_forest extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("vision_aoe")
	}
}
