import Ability from "../../Base/Ability"

export default class spawnlord_master_bash extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Spawnlord_Master_Bash>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spawnlord_master_bash", spawnlord_master_bash)