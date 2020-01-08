import Ability from "../Base/Ability"

export default class spawnlord_master_stomp extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Spawnlord_Master_Stomp
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spawnlord_master_stomp", spawnlord_master_stomp)
