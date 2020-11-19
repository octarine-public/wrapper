import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("death_prophet_carrion_swarm")
export default class death_prophet_carrion_swarm extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("start_radius")
	}

	public get EndRadius(): number {
		return this.GetSpecialValue("end_radius")
	}

	public get Range(): number {
		return this.GetSpecialValue("range")
	}

	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
}
