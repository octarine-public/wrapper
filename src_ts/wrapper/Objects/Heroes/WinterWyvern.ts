import Hero from "../Base/Hero"

export default class WinterWyvern extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Winter_Wyvern
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Winter_Wyvern", WinterWyvern)