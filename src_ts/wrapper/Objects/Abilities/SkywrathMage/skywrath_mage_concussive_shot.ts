import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("skywrath_mage_concussive_shot")
export default class skywrath_mage_concussive_shot extends Ability {
	public get AOERadius(): number {
		let owner = this.Owner
		if (owner !== undefined) {
			let talent = owner.GetAbilityByName("special_bonus_unique_skywrath_4")
			if (talent !== undefined && talent.Level !== 0)
				return Number.MAX_SAFE_INTEGER
		}
		return this.GetSpecialValue("launch_radius")
	}

	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
}
