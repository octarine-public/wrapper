import Ability from "../Base/Ability"

export default class night_stalker_hunter_in_the_night extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_NightStalker_HunterInTheNight
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("night_stalker_hunter_in_the_night", night_stalker_hunter_in_the_night)
