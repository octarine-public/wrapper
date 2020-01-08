import Hero from "../Base/Hero"

export default class npc_dota_hero_phantom_lancer extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_PhantomLancer
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_PhantomLancer", npc_dota_hero_phantom_lancer)
