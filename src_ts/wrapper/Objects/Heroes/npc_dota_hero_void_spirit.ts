import Hero from "../Base/Hero"

export default class npc_dota_hero_void_spirit extends Hero {
	public NativeEntity: Nullable<CDOTA_Unit_Hero_Void_Spirit>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Void_Spirit", npc_dota_hero_void_spirit)
