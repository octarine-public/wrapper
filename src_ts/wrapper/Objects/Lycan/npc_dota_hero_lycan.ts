import Hero from "../Base/Hero"

export default class npc_dota_hero_lycan extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Lycan
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Lycan", npc_dota_hero_lycan)
