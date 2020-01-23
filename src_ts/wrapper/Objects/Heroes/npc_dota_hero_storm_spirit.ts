import Hero from "../Base/Hero"

export default class npc_dota_hero_storm_spirit extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_StormSpirit>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_StormSpirit", npc_dota_hero_storm_spirit)
