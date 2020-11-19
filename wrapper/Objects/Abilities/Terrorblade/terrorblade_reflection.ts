import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("terrorblade_reflection")
export default class terrorblade_reflection extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("range")
	}
}
