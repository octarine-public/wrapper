import { WrapperClass } from "../../Decorators"
import { GameActivity_t } from "../../Enums/GameActivity_t"
import EntityManager from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import Hero from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Morphling")
export default class npc_dota_hero_morphling extends Hero {
	public IsGuaranteedReal = false
	public get IsIllusion(): boolean {
		return !this.IsGuaranteedReal && super.IsIllusion
	}
	public CalculateActivityModifiers(activity: GameActivity_t, ar: string[]): void {
		super.CalculateActivityModifiers(activity, ar)
		// modifier_tiny_craggy_exterior is NOT a mistake.
		// it's still not updated in Valve code for Rubick and Morphling as of 6/11/2021
		if (this.HasBuffByName("modifier_tiny_craggy_exterior"))
			ar.push("tree")
	}
}

EventsSDK.on("PostDataUpdate", () => {
	EntityManager.GetEntitiesByClass(npc_dota_hero_morphling).forEach(hero => {
		if (!hero.IsGuaranteedReal && !hero.IsIllusion)
			hero.IsGuaranteedReal = true
	})
})
