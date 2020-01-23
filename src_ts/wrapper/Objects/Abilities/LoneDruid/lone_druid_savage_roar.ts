import Ability from "../../Base/Ability"

export default class lone_druid_savage_roar extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_LoneDruid_SavageRoar>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_savage_roar", lone_druid_savage_roar)
