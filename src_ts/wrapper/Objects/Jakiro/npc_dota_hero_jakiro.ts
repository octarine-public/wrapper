import Hero from "../Base/Hero"

export default class npc_dota_hero_jakiro extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Jakiro
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Jakiro", npc_dota_hero_jakiro)
