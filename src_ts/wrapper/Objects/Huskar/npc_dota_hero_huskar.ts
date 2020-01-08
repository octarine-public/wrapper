import Hero from "../Base/Hero"

export default class npc_dota_hero_huskar extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Huskar
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Huskar", npc_dota_hero_huskar)
