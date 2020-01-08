import Hero from "../Base/Hero"

export default class npc_dota_hero_oracle extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Oracle
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Oracle", npc_dota_hero_oracle)
