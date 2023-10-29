import { WrapperClass } from "../../Decorators"
import { DOTACustomHeroPickRulesPhase } from "../../Enums/DOTACustomHeroPickRulesPhase"
import { EventsSDK } from "../../Managers/EventsSDK"
import { RegisterFieldHandler } from "../NativeToSDK"
import { Entity } from "./Entity"

@WrapperClass("CDOTATurboHeroPickRules")
export class CTurboHeroPickRules extends Entity {
	/** @readonly */
	public Phase = DOTACustomHeroPickRulesPhase.Ban
}

RegisterFieldHandler(
	CTurboHeroPickRules,
	"m_Phase",
	(turboRules, newVal) => (turboRules.Phase = Number(newVal))
)

export let TurboHeroPickRules: Nullable<CTurboHeroPickRules>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof CTurboHeroPickRules) {
		TurboHeroPickRules = ent
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof CTurboHeroPickRules) {
		TurboHeroPickRules = undefined
	}
})
