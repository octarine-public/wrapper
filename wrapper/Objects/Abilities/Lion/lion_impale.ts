import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("lion_impale")
export default class lion_impale extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("width")
	}
	public get CastRange(): number {
		let range = super.CastRange
		const talent = this.Owner?.GetAbilityByName("special_bonus_unique_lion_2")
		if (talent !== undefined && talent.Level > 0)
			range += talent.GetSpecialValue("value")
		return range
	}
}
