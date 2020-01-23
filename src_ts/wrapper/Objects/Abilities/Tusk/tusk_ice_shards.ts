import Ability from "../../Base/Ability"

export default class tusk_ice_shards extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tusk_IceShards>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tusk_ice_shards", tusk_ice_shards)
