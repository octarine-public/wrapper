import Ability from "../../Base/Ability"

export default class lone_druid_entangling_claws extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_LoneDruid_Entangling_Claws>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_entangling_claws", lone_druid_entangling_claws)
