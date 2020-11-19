import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("dark_seer_surge")
export default class dark_seer_surge extends Ability {
	public get AOERadius(): number {
		const talent = this.Owner?.GetAbilityByName("special_bonus_unique_dark_seer_3")
		if (talent !== undefined && talent.Level !== 0)
			return talent.GetSpecialValue("value")
		return 0
	}
}
