import Ability from "../Base/Ability"

export default class tusk_ice_shards extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tusk_IceShards
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tusk_ice_shards", tusk_ice_shards)
