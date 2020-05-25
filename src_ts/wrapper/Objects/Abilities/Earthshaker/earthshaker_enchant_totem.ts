import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("earthshaker_enchant_totem")
export default class earthshaker_enchant_totem extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("aftershock_range")
	}
}
