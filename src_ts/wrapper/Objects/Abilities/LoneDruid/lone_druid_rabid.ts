import Ability from "../../Base/Ability"

export default class lone_druid_rabid extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_LoneDruid_Rabid>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_rabid", lone_druid_rabid)