import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("beastmaster_inner_beast")
export default class beastmaster_inner_beast extends Ability {
	public get AuraRadius(): number {
		return this.GetSpecialValue("radius")
	}
}
