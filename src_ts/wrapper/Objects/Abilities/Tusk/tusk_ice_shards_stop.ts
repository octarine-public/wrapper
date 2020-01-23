import Ability from "../../Base/Ability"

export default class tusk_ice_shards_stop extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Tusk_IceShards_Stop>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tusk_ice_shards_stop", tusk_ice_shards_stop)
