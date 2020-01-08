import Hero from "../Base/Hero"

export default class npc_dota_hero_shredder extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Shredder
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Shredder", npc_dota_hero_shredder)
