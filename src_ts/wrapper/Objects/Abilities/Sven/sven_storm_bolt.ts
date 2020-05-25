import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("sven_storm_bolt")
export default class sven_storm_bolt extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("bolt_aoe")
	}
	public get Speed(): number {
		return this.GetSpecialValue("bolt_speed")
	}
}
