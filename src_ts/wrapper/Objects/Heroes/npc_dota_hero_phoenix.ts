import Hero from "../Base/Hero"

export default class npc_dota_hero_phoenix extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Phoenix>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Phoenix", npc_dota_hero_phoenix)
