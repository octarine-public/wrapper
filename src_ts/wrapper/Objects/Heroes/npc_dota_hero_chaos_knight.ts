import Hero from "../Base/Hero"

export default class npc_dota_hero_chaos_knight extends Hero {
	public readonly NativeEntity!: C_DOTA_Unit_Hero_ChaosKnight
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_ChaosKnight", npc_dota_hero_chaos_knight)
