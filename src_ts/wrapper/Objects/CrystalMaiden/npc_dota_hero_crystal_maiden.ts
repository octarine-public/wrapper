import Hero from "../Base/Hero"

export default class npc_dota_hero_crystal_maiden extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_CrystalMaiden
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_CrystalMaiden", npc_dota_hero_crystal_maiden)
