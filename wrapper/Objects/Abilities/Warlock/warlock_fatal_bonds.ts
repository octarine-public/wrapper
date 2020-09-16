import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("warlock_fatal_bonds")
export default class warlock_fatal_bonds extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("search_aoe")
	}
}
