import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("troll_warlord_whirling_axes_ranged")
export default class troll_warlord_whirling_axes_ranged extends Ability {
	public get EndRadius(): number {
		return 206.17 // noе in special data
	}

	public get CastRange(): number {
		return this.GetSpecialValue("axe_range")
	}

	public get AOERadius(): number {
		return this.GetSpecialValue("axe_width")
	}

	public get Speed(): number {
		return this.GetSpecialValue("axe_speed")
	}
}
