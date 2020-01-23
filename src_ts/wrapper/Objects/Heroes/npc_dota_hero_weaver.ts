import Hero from "../Base/Hero"

export default class npc_dota_hero_weaver extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Weaver>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Weaver", npc_dota_hero_weaver)
