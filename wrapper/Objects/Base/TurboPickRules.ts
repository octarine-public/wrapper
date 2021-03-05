import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTACustomHeroPickRulesPhase_t } from "../../Enums/DOTACustomHeroPickRulesPhase_t"
import EventsSDK from "../../Managers/EventsSDK"
import Entity from "./Entity"

@WrapperClass("C_DOTATurboHeroPickRules")
export default class CTurboHeroPickRules extends Entity {
	@NetworkedBasicField("m_Phase")
	public Phase: DOTACustomHeroPickRulesPhase_t = DOTACustomHeroPickRulesPhase_t.PHASE_Ban
}

export let TurboHeroPickRules: Nullable<CTurboHeroPickRules>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof CTurboHeroPickRules)
		TurboHeroPickRules = ent
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof CTurboHeroPickRules)
		TurboHeroPickRules = undefined
})
