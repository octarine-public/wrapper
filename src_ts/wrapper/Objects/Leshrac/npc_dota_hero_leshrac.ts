import Hero from "../Base/Hero"

export default class npc_dota_hero_leshrac extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Leshrac
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Leshrac", npc_dota_hero_leshrac)