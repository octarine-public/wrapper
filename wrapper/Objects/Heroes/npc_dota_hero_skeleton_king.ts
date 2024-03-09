import { WrapperClass } from "../../Decorators"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_SkeletonKing")
export class npc_dota_hero_skeleton_king extends Hero {
	public get CanReincarnate() {
		return (
			super.CanReincarnate ||
			(this.GetAbilityByName("skeleton_king_reincarnation")?.CanBeCasted() ?? false)
		)
	}
}
