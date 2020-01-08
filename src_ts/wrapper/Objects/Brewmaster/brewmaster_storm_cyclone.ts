import Ability from "../Base/Ability"

export default class brewmaster_storm_cyclone extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Brewmaster_Cyclone
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("brewmaster_storm_cyclone", brewmaster_storm_cyclone)
