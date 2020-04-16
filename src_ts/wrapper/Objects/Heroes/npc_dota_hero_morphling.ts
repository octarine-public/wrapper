import Hero from "../Base/Hero"

export default class npc_dota_hero_morphling extends Hero {
	public get IsIllusion(): boolean {
		if (this.HasBuffByName("modifier_morphling_replicate"))
			return false
		return super.IsIllusion
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Morphling", npc_dota_hero_morphling)
