import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("earthshaker_aftershock")
export default class earthshaker_aftershock extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("aftershock_range")
	}
}
