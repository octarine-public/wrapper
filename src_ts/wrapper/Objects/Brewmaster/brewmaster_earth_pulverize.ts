import Ability from "../Base/Ability"

export default class brewmaster_earth_pulverize extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Brewmaster_Pulverize
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("brewmaster_earth_pulverize", brewmaster_earth_pulverize)
