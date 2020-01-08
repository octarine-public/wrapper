import Hero from "../Base/Hero"

export default class npc_dota_hero_visage extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Visage
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Visage", npc_dota_hero_visage)
