import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("dazzle_poison_touch")
export default class dazzle_poison_touch extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("start_radius")
	}

	public get EndRadius(): number {
		return this.GetSpecialValue("end_radius")
	}

	public get Range(): number {
		return this.GetSpecialValue("end_distance")
	}
}
