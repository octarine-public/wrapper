import Ability from "../Base/Ability"

export default class seasonal_summon_ti9_balloon extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Seasonal_Summon_TI9_Balloon
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("seasonal_summon_ti9_balloon", seasonal_summon_ti9_balloon)
