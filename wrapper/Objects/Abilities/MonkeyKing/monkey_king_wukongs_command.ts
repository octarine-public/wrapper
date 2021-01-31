import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("monkey_king_wukongs_command")
export default class monkey_king_wukongs_command extends Ability {
	public get AOERadius() {
		const owner = this.Owner
		if (owner === undefined)
			return 0
		const talent = owner.GetAbilityByName("special_bonus_unique_monkey_king_6")
		if (talent !== undefined && talent.Level !== 0)
			return talent.GetSpecialValue("value")
		return 780
	}
}
