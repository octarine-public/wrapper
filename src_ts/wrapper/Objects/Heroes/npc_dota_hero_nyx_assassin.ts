import Hero from "../Base/Hero"

export default class npc_dota_hero_nyx_assassin extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Nyx_Assassin>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Nyx_Assassin", npc_dota_hero_nyx_assassin)
