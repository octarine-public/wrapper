import Ability from "../../Base/Ability"

export default class dark_seer_surge extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_DarkSeer_Surge

	public get AOERadius(): number {
		return this.Owner?.GetTalentValue("special_bonus_unique_dark_seer_3") ?? 0
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_seer_surge", dark_seer_surge)
