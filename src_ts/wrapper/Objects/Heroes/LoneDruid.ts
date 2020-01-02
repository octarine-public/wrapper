import Hero from "../Base/Hero"

export default class LoneDruid extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_LoneDruid
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_LoneDruid", LoneDruid)