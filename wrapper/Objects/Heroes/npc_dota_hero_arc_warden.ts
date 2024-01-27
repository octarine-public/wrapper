import { WrapperClass } from "../../Decorators"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_ArcWarden")
export class npc_dota_hero_arc_warden extends Hero {
	public get IsIllusion(): boolean {
		return (
			super.IsIllusion && !this.HasBuffByName("modifier_arc_warden_tempest_double")
		)
	}
}
