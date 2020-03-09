import Hero from "../Base/Hero"

export default class npc_dota_hero_morphling extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_Morphling>

	public get IsIllusion(): boolean {
		if (this.HasBuffByName("modifier_morphling_replicate"))
			return false
		return super.IsIllusion
	}

	public get HealthBarOffset(): number {
		let offset = super.HealthBarOffset
		if (!this.HasBuffByName("modifier_morphling_replicate_manager"))
			offset -= 10
		return offset
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Morphling", npc_dota_hero_morphling)
