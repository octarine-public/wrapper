import Ability from "../Base/Ability"

export default class seasonal_summon_penguin extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Seasonal_Summon_Penguin
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("seasonal_summon_penguin", seasonal_summon_penguin)
