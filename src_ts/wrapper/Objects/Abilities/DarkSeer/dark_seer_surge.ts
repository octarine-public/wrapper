import Ability from "../../Base/Ability"

export default class dark_seer_surge extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DarkSeer_Surge

	public get AOERadius(): number {
		let talent = this.Owner?.GetTalentValue("special_bonus_unique_dark_seer_3")
		return talent !== undefined ? this.GetSpecialValue("value") : 0
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_seer_surge", dark_seer_surge)
