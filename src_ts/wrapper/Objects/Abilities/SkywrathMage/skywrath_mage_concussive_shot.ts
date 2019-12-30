import Ability from "../../Base/Ability"

export default class skywrath_mage_concussive_shot extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Skywrath_Mage_Concussive_Shot

	public get AOERadius(): number {
		return (this.Owner?.GetTalentValue("special_bonus_unique_skywrath_4") ?? 0) !== 0
			? Number.MAX_SAFE_INTEGER
			: this.GetSpecialValue("launch_radius")
	}

	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("skywrath_mage_concussive_shot", skywrath_mage_concussive_shot)
