import Ability from "../Base/Ability"

export default class techies_remote_mines extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Techies_RemoteMines
	// ability special "detonate_delay": 0.25, activation_time "activation_time": 2
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("techies_remote_mines", techies_remote_mines)
