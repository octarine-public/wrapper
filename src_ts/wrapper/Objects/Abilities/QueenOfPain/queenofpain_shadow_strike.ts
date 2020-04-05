import Ability from "../../Base/Ability"

export default class queenofpain_shadow_strike extends Ability {
	public get AOERadius(): number {
		let radius = 0,
			owner = this.Owner
		if (owner !== undefined) {
			let talent = owner.GetAbilityByName("special_bonus_unique_queen_of_pain")
			if (talent !== undefined && talent.Level !== 0)
				radius += talent.GetSpecialValue("value")
		}
		return radius
	}
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("queenofpain_shadow_strike", queenofpain_shadow_strike)
