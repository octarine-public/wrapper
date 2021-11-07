import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("marci_unleash")
export default class marci_unleash extends Ability {
	public get Duration(): number {
		return this.GetSpecialValue("duration")
	}
	public get AOERadius(): number {
		return this.GetSpecialValue("pulse_radius")
	}
}
