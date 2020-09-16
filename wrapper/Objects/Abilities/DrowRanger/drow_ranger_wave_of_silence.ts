import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("drow_ranger_wave_of_silence")
export default class drow_ranger_wave_of_silence extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("wave_width")
	}
	public get Speed(): number {
		return this.GetSpecialValue("wave_speed")
	}
}
