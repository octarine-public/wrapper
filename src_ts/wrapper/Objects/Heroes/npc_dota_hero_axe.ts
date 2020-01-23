import Hero from "../Base/Hero"

export default class npc_dota_hero_axe extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Axe>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Axe", npc_dota_hero_axe)
