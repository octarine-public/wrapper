import Hero from "../Base/Hero"

export default class npc_dota_hero_silencer extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Silencer
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Silencer", npc_dota_hero_silencer)
