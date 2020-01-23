import Hero from "../Base/Hero"

export default class npc_dota_hero_necrolyte extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Necrolyte>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Necrolyte", npc_dota_hero_necrolyte)
