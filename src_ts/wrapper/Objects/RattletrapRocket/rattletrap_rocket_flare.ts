import Ability from "../Base/Ability"

export default class rattletrap_rocket_flare extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Rattletrap_RocketFlare
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rattletrap_rocket_flare", rattletrap_rocket_flare)