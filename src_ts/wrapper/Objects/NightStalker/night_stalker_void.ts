import Ability from "../Base/Ability"

export default class night_stalker_void extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_NightStalker_Void

	public get AOERadius(): number {
		return this.GetSpecialValue("radius_scepter")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("night_stalker_void", night_stalker_void)
