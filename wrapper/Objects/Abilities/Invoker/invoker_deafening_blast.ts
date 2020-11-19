import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("invoker_deafening_blast")
export default class invoker_deafening_blast extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("radius_end")
	}
	public get AOERadius(): number {
		return this.GetSpecialValue("radius_start")
	}
	public get Speed(): number {
		return this.GetSpecialValue("travel_speed")
	}
}
