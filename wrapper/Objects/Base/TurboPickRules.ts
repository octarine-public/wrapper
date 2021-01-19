import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import EventsSDK from "../../Managers/EventsSDK"
import Entity from "./Entity"

@WrapperClass("C_DOTATurboHeroPickRules")
export default class CTurboHeroPickRules extends Entity {
	@NetworkedBasicField("m_Phase")
	public Phase: DOTACustomHeroPickRulesPhase_t = DOTACustomHeroPickRulesPhase_t.PHASE_Ban
}

export let TurboHeroPickRules: Nullable<CTurboHeroPickRules>
EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof CTurboHeroPickRules)
		TurboHeroPickRules = ent
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof CTurboHeroPickRules)
		TurboHeroPickRules = undefined
})
