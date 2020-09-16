import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("jakiro_dual_breath")
export default class jakiro_dual_breath extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("end_radius")
	}
	public get AOERadius(): number {
		return this.GetSpecialValue("start_radius")
	}
	public get Speed(): number {
		return this.GetSpecialValue("speed_fire")
	}
}
