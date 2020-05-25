import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("vengefulspirit_wave_of_terror")
export default class vengefulspirit_wave_of_terror extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("wave_width")
	}

	public get Speed(): number {
		return this.GetSpecialValue("wave_speed")
	}
}
