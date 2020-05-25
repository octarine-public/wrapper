import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("troll_warlord_whirling_axes_melee")
export default class troll_warlord_whirling_axes_melee extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("max_range")
	}
}
