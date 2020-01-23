import Hero from "../Base/Hero"

export default class npc_dota_hero_razor extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Razor>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Razor", npc_dota_hero_razor)
