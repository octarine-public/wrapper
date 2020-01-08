import Hero from "../Base/Hero"

export default class npc_dota_hero_naga_siren extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Naga_Siren
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Naga_Siren", npc_dota_hero_naga_siren)
