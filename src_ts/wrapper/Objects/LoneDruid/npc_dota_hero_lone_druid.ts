import Hero from "../Base/Hero"

export default class npc_dota_hero_lone_druid extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_LoneDruid
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_LoneDruid", npc_dota_hero_lone_druid)
