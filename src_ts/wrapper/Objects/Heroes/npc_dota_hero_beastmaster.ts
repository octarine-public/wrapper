import Hero from "../Base/Hero"

export default class npc_dota_hero_beastmaster extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Beastmaster>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Beastmaster", npc_dota_hero_beastmaster)
