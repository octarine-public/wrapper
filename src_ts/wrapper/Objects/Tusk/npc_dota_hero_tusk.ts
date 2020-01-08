import Hero from "../Base/Hero"

export default class npc_dota_hero_tusk extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Tusk
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Tusk", npc_dota_hero_tusk)
