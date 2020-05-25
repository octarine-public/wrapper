import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("dark_seer_surge")
export default class dark_seer_surge extends Ability {
	public get AOERadius(): number {
		let radius = 0,
			owner = this.Owner
		if (owner !== undefined) {
			let talent = owner.GetAbilityByName("special_bonus_unique_dark_seer_3")
			if (talent !== undefined && talent.Level !== 0)
				radius += talent.GetSpecialValue("value")
		}
		return radius
	}
}
