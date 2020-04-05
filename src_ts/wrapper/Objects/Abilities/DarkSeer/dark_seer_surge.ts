import Ability from "../../Base/Ability"

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

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_seer_surge", dark_seer_surge)
