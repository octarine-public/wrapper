import Hero from "../Base/Hero"

export default class npc_dota_hero_clinkz extends Hero {
	public readonly NativeEntity!: C_DOTA_Unit_Hero_Clinkz
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Clinkz", npc_dota_hero_clinkz)
