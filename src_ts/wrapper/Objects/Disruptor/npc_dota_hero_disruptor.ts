import Hero from "../Base/Hero"

export default class npc_dota_hero_disruptor extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Disruptor
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Disruptor", npc_dota_hero_disruptor)
