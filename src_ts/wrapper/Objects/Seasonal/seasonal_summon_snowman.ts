import Ability from "../Base/Ability"

export default class seasonal_summon_snowman extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Seasonal_Summon_Snowman
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("seasonal_summon_snowman", seasonal_summon_snowman)
