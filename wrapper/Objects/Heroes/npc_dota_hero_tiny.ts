import { WrapperClass } from "../../Decorators"
import { GameActivity } from "../../Enums/GameActivity"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Tiny")
export class npc_dota_hero_tiny extends Hero {
	public CalculateActivityModifiers(
		activity: GameActivity,
		ar: string[]
	): void {
		super.CalculateActivityModifiers(activity, ar)
		if (this.HasBuffByName("modifier_tiny_tree_grab")) ar.push("tree")
	}
}
