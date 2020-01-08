import Hero from "../Base/Hero"

export default class npc_dota_hero_lich extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Lich
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Lich", npc_dota_hero_lich)
