import Hero from "../Base/Hero"

export default class npc_dota_hero_abaddon extends Hero {
	public readonly m_pBaseEntity!: CDOTA_Unit_Hero_Abaddon
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Abaddon", npc_dota_hero_abaddon)
