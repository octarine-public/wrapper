import Hero from "../Base/Hero"

export default class npc_dota_hero_earthshaker extends Hero {
	public readonly NativeEntity!: C_DOTA_Unit_Hero_Earthshaker
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Earthshaker", npc_dota_hero_earthshaker)
