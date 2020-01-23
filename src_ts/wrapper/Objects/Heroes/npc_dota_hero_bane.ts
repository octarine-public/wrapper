import Hero from "../Base/Hero"

export default class npc_dota_hero_bane extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Bane>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Bane", npc_dota_hero_bane)
