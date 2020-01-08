import Hero from "../Base/Hero"

export default class npc_dota_hero_rubick extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Rubick
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Rubick", npc_dota_hero_rubick)
