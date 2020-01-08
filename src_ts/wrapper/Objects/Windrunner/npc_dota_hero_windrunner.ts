import Hero from "../Base/Hero"

export default class npc_dota_hero_windrunner extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Windrunner
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Windrunner", npc_dota_hero_windrunner)
