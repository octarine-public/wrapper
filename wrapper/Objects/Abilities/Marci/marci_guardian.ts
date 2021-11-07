import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("marci_guardian")
export default class marci_guardian extends Ability {
	public get Duration(): number {
		return this.GetSpecialValue("buff_duration")
	}
}
