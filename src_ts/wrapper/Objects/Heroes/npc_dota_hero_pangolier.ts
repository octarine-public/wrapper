import Hero from "../Base/Hero"

export default class npc_dota_hero_pangolier extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Pangolier>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Pangolier", npc_dota_hero_pangolier)
