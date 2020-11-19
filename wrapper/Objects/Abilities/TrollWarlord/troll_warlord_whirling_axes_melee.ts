import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("troll_warlord_whirling_axes_melee")
export default class troll_warlord_whirling_axes_melee extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("max_range")
	}
}
