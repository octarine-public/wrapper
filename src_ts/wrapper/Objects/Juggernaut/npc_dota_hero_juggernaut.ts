import Hero from "../Base/Hero"

export default class npc_dota_hero_juggernaut extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Juggernaut
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Juggernaut", npc_dota_hero_juggernaut)
