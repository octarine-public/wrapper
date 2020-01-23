import Hero from "../Base/Hero"

export default class npc_dota_hero_antimage extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_AntiMage>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_AntiMage", npc_dota_hero_antimage)
