import Hero from "../Base/Hero"

export default class npc_dota_hero_tidehunter extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Tidehunter
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Tidehunter", npc_dota_hero_tidehunter)
