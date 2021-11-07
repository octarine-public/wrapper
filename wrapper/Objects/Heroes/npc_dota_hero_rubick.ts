import { WrapperClass } from "../../Decorators"
import { GameActivity_t } from "../../Enums/GameActivity_t"
import Hero from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Rubick")
export default class npc_dota_hero_rubick extends Hero {
	public CalculateActivityModifiers(activity: GameActivity_t, ar: string[]): void {
		super.CalculateActivityModifiers(activity, ar)
		// modifier_tiny_craggy_exterior is NOT a mistake.
		// it's still not updated in Valve code for Rubick and Morphling as of 6/11/2021
		if (this.HasBuffByName("modifier_tiny_craggy_exterior"))
			ar.push("tree")
	}
}
