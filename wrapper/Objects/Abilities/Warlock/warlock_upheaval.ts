import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("warlock_upheaval")
export default class warlock_upheaval extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("aoe")
	}
}
