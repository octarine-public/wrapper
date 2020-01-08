import Hero from "../Base/Hero"

export default class npc_dota_hero_death_prophet extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_DeathProphet
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_DeathProphet", npc_dota_hero_death_prophet)
