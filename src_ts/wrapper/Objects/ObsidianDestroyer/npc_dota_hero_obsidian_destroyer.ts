import Hero from "../Base/Hero"

export default class npc_dota_hero_obsidian_destroyer extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Obsidian_Destroyer
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Obsidian_Destroyer", npc_dota_hero_obsidian_destroyer)
