import Hero from "../Base/Hero"

export default class npc_dota_hero_alchemist extends Hero {
	public NativeEntity: Nullable<CDOTA_Unit_Hero_Alchemist>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Alchemist", npc_dota_hero_alchemist)
