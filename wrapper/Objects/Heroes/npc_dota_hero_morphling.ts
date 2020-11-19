import { WrapperClass } from "../../Decorators"
import Hero from "../Base/Hero"

@WrapperClass("C_DOTA_Unit_Hero_Morphling")
export default class npc_dota_hero_morphling extends Hero {
	public get IsIllusion(): boolean {
		if (this.HasBuffByName("modifier_morphling_replicate"))
			return false
		return super.IsIllusion
	}
}
