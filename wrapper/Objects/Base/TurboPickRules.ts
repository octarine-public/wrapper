import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTACustomHeroPickRulesPhase } from "../../Enums/DOTACustomHeroPickRulesPhase"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Entity } from "./Entity"

@WrapperClass("CDOTATurboHeroPickRules")
export class CTurboHeroPickRules extends Entity {
	@NetworkedBasicField("m_Phase")
	public Phase: DOTACustomHeroPickRulesPhase = DOTACustomHeroPickRulesPhase.Ban
}

export let TurboHeroPickRules: Nullable<CTurboHeroPickRules>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof CTurboHeroPickRules) TurboHeroPickRules = ent
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof CTurboHeroPickRules) TurboHeroPickRules = undefined
})
