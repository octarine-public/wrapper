import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("warlock_upheaval")
export default class warlock_upheaval extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("aoe")
	}
}
