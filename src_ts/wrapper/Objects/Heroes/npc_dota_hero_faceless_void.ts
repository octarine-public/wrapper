import Hero from "../Base/Hero"

export default class npc_dota_hero_faceless_void extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_FacelessVoid>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_FacelessVoid", npc_dota_hero_faceless_void)