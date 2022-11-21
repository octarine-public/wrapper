import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTACustomHeroPickRulesPhase } from "../../Enums/DOTACustomHeroPickRulesPhase"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Entity } from "./Entity"

@WrapperClass("CDOTACustomGameHeroPickRules")
export class CCustomHeroPickRules extends Entity {
	@NetworkedBasicField("m_Phase")
	public Phase: DOTACustomHeroPickRulesPhase = DOTACustomHeroPickRulesPhase.Ban
	@NetworkedBasicField("m_nNumBansPerTeam")
	public NumBansPerTeam: number = 0
	@NetworkedBasicField("m_flEnterTime")
	public EnterTime: number = 0
}

export let CustomHeroPickRules: Nullable<CCustomHeroPickRules>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof CCustomHeroPickRules) CustomHeroPickRules = ent
})

EventsSDK.on("EntityDestroyed", ent => {
	if (CustomHeroPickRules === ent) CustomHeroPickRules = undefined
})
