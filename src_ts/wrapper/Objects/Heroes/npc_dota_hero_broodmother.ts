import Hero from "../Base/Hero"

export default class npc_dota_hero_broodmother extends Hero {
	public readonly NativeEntity!: C_DOTA_Unit_Hero_Broodmother
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Broodmother", npc_dota_hero_broodmother)
