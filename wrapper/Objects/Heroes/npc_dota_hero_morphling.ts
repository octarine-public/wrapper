import { WrapperClass } from "../../Decorators"
import { GameActivity } from "../../Enums/GameActivity"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Morphling")
export class npc_dota_hero_morphling extends Hero {
	public IsGuaranteedReal_: boolean = false

	public get IsIllusion(): boolean {
		return this.IsIllusion_ || (!this.IsGuaranteedReal_ && super.IsIllusion)
	}
	public CalculateActivityModifiers(activity: GameActivity, ar: string[]): void {
		super.CalculateActivityModifiers(activity, ar)
		// modifier_tiny_craggy_exterior is NOT a mistake.
		// it's still not updated in Valve code for Rubick and Morphling as of 6/11/2021
		if (this.HasBuffByName("modifier_tiny_craggy_exterior")) {
			ar.push("tree")
		}
	}
}
