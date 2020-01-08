import Ability from "../Base/Ability"

export default class lone_druid_rabid extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_LoneDruid_Rabid
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_rabid", lone_druid_rabid)
