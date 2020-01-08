import Hero from "../Base/Hero"

export default class npc_dota_hero_spectre extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Spectre
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Spectre", npc_dota_hero_spectre)
