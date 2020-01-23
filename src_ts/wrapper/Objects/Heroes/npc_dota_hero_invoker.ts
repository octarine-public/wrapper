import Hero from "../Base/Hero"

export default class npc_dota_hero_invoker extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Invoker>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Invoker", npc_dota_hero_invoker)
