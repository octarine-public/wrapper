import Hero from "../Base/Hero"

export default class npc_dota_hero_troll_warlord extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_TrollWarlord>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_TrollWarlord", npc_dota_hero_troll_warlord)
