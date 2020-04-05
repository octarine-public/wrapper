import Ability from "../../Base/Ability"

export default class lion_impale extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("width")
	}
	public get CastRange(): number {
		let range = super.CastRange,
			owner = this.Owner
		if (owner !== undefined) {
			let talent = owner.GetAbilityByName("special_bonus_unique_lion_2")
			if (talent !== undefined && talent.Level > 0)
				range += talent.GetSpecialValue("value")
		}
		return range
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lion_impale", lion_impale)
