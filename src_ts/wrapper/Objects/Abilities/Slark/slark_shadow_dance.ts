import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("slark_shadow_dance")
export default class slark_shadow_dance extends Ability {
	public get ActivationDelay() {
		return this.GetSpecialValue("activation_delay")
	}
}
