import Ability from "../../Base/Ability"

export default class spawnlord_master_freeze extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Spawnlord_Master_Freeze>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spawnlord_master_freeze", spawnlord_master_freeze)
