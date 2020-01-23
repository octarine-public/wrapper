import Hero from "../Base/Hero"

export default class npc_dota_hero_night_stalker extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_NightStalker>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_NightStalker", npc_dota_hero_night_stalker)
