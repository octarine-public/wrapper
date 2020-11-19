import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("storm_spirit_overload")
export default class storm_spirit_overload extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("overload_aoe")
	}
}
