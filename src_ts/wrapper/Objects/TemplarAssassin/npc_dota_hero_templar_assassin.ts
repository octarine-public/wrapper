import Hero from "../Base/Hero"

export default class npc_dota_hero_templar_assassin extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_TemplarAssassin
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_TemplarAssassin", npc_dota_hero_templar_assassin)
