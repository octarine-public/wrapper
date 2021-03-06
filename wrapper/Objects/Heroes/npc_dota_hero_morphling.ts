import { WrapperClass } from "../../Decorators"
import EntityManager from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import Hero from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Morphling")
export default class npc_dota_hero_morphling extends Hero {
	public IsGuaranteedReal = false
	public get isIllusion(): boolean {
		return !this.IsGuaranteedReal && super.IsIllusion
	}
}

EventsSDK.on("PostDataUpdate", () => {
	EntityManager.GetEntitiesByClass(npc_dota_hero_morphling).forEach(hero => {
		if (!hero.IsGuaranteedReal && !hero.IsIllusion)
			hero.IsGuaranteedReal = true
	})
})
