import Ability from "../../Base/Ability"

export default class skywrath_mage_concussive_shot extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Skywrath_Mage_Concussive_Shot>

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

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("skywrath_mage_concussive_shot", skywrath_mage_concussive_shot)
