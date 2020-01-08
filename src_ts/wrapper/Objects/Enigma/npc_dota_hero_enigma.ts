import Hero from "../Base/Hero"

export default class npc_dota_hero_enigma extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Enigma
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Enigma", npc_dota_hero_enigma)
