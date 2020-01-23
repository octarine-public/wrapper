import Hero from "../Base/Hero"

export default class npc_dota_hero_slardar extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Slardar>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Slardar", npc_dota_hero_slardar)
