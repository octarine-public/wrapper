import Hero from "../Base/Hero"

export default class npc_dota_hero_drow_ranger extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_DrowRanger
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_DrowRanger", npc_dota_hero_drow_ranger)
