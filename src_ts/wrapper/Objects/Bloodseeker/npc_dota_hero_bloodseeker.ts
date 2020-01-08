import Hero from "../Base/Hero"

export default class npc_dota_hero_bloodseeker extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Bloodseeker
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Bloodseeker", npc_dota_hero_bloodseeker)
