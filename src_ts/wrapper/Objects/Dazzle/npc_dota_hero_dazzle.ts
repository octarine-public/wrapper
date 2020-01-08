import Hero from "../Base/Hero"

export default class npc_dota_hero_dazzle extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Dazzle
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Dazzle", npc_dota_hero_dazzle)
