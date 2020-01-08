import Hero from "../Base/Hero"

export default class npc_dota_hero_lion extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Lion
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Lion", npc_dota_hero_lion)
