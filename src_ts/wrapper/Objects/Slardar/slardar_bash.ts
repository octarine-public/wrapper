import Ability from "../Base/Ability"

export default class slardar_bash extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Slardar_Bash
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("slardar_bash", slardar_bash)
