import Hero from "../Base/Hero"

export default class npc_dota_hero_sand_king extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_SandKing
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_SandKing", npc_dota_hero_sand_king)
