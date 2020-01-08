import Hero from "../Base/Hero"

export default class npc_dota_hero_magnataur extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Magnataur
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Magnataur", npc_dota_hero_magnataur)
