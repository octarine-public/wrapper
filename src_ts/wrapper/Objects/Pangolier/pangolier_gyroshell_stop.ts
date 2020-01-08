import Ability from "../Base/Ability"

export default class pangolier_gyroshell_stop extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Pangolier_GyroshellStop
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pangolier_gyroshell_stop", pangolier_gyroshell_stop)
