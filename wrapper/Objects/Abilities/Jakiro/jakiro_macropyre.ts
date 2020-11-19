import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("jakiro_macropyre")
export default class jakiro_macropyre extends Ability {
	public get BaseCastRange(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("cast_range_scepter") : super.CastRange
	}
}
