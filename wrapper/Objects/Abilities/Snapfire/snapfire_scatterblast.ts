import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("snapfire_scatterblast")
export default class snapfire_scatterblast extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("blast_width_end")
	}

	public get AOERadius(): number {
		return this.GetSpecialValue("blast_width_initial")
	}

	public get Speed(): number {
		return this.GetSpecialValue("blast_speed")
	}
}
