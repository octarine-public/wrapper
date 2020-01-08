import Ability from "../Base/Ability"

export default class brewmaster_storm_wind_walk extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Brewmaster_WindWalk
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("brewmaster_storm_wind_walk", brewmaster_storm_wind_walk)
