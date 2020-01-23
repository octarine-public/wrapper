import Hero from "../Base/Hero"

export default class npc_dota_hero_slark extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Slark>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Slark", npc_dota_hero_slark)
