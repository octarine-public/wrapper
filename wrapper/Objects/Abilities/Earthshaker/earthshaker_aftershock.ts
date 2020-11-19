import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("earthshaker_aftershock")
export default class earthshaker_aftershock extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("aftershock_range")
	}
}
