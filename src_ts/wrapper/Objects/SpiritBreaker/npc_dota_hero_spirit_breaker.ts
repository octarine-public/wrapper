import Hero from "../Base/Hero"

export default class npc_dota_hero_spirit_breaker extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_SpiritBreaker
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_SpiritBreaker", npc_dota_hero_spirit_breaker)
