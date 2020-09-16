import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("terrorblade_reflection")
export default class terrorblade_reflection extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("range")
	}
}
