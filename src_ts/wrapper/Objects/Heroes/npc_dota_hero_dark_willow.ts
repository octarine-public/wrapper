import Hero from "../Base/Hero"

export default class npc_dota_hero_dark_willow extends Hero {
	public readonly NativeEntity!: C_DOTA_Unit_Hero_DarkWillow
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_DarkWillow", npc_dota_hero_dark_willow)
