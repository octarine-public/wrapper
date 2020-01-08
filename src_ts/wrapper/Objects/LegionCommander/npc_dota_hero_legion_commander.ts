import Hero from "../Base/Hero"

export default class npc_dota_hero_legion_commander extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Legion_Commander
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Legion_Commander", npc_dota_hero_legion_commander)
