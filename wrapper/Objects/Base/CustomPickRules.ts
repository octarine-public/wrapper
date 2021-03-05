import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTACustomHeroPickRulesPhase_t } from "../../Enums/DOTACustomHeroPickRulesPhase_t"
import EventsSDK from "../../Managers/EventsSDK"
import Entity from "./Entity"

@WrapperClass("C_DOTACustomGameHeroPickRules")
export default class CCustomHeroPickRules extends Entity {
	@NetworkedBasicField("m_Phase")
	public Phase: DOTACustomHeroPickRulesPhase_t = DOTACustomHeroPickRulesPhase_t.PHASE_Ban
	@NetworkedBasicField("m_nNumBansPerTeam")
	public NumBansPerTeam: number = 0
	@NetworkedBasicField("m_flEnterTime")
	public EnterTime: number = 0
}

export let CustomHeroPickRules: Nullable<CCustomHeroPickRules>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof CCustomHeroPickRules)
		CustomHeroPickRules = ent
})

EventsSDK.on("EntityDestroyed", ent => {
	if (CustomHeroPickRules === ent)
		CustomHeroPickRules = undefined
})
