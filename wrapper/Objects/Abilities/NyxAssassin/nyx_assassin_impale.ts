import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("nyx_assassin_impale")
export default class nyx_assassin_impale extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("width")
	}
}
