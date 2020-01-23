import Hero from "../Base/Hero"

export default class npc_dota_hero_brewmaster extends Hero {
	public readonly NativeEntity!: C_DOTA_Unit_Hero_Brewmaster
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Brewmaster", npc_dota_hero_brewmaster)
