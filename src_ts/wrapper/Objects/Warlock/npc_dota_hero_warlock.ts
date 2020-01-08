import Hero from "../Base/Hero"

export default class npc_dota_hero_warlock extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Warlock
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Warlock", npc_dota_hero_warlock)
