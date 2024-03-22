import { WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { RegisterFieldHandler } from "../NativeToSDK"
import { Entity } from "./Entity"

@WrapperClass("CEconWearable")
export class Wearable extends Entity {
	public ItemDefinitionIndex = 0
	public ItemName = ""
	public HealthBarOffset: Nullable<number>
	public AdditionalWearable: Nullable<Wearable>
	public AdditionalWearable_ = 0

	public get Name() {
		return this.ItemName
	}
}
export const Wearables = EntityManager.GetEntitiesByClass(Wearable)

RegisterFieldHandler(Wearable, "m_iItemDefinitionIndex", (ent, newVal) => {
	ent.ItemDefinitionIndex = Number(newVal as bigint)
	ent.ItemName = GetEconItemName(ent.ItemDefinitionIndex) ?? ""
	ent.HealthBarOffset = GetEconItemHealthBarOffset(ent.ItemDefinitionIndex)
})
RegisterFieldHandler(Wearable, "m_hAdditionalWearable", (ent, newVal) => {
	ent.AdditionalWearable_ = newVal as number
	ent.AdditionalWearable = EntityManager.EntityByIndex(ent.Owner_)
})
EventsSDK.on("PreEntityCreated", ent => {
	if (ent.Index === 0 || !(ent instanceof Wearable)) {
		return
	}
	for (let index = Wearables.length - 1; index > -1; index--) {
		const wearable = Wearables[index]
		if (ent.HandleMatches(wearable.AdditionalWearable_)) {
			wearable.AdditionalWearable = ent
		}
	}
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent.Index === 0 || !(ent instanceof Wearable)) {
		return
	}
	for (let index = Wearables.length - 1; index > -1; index--) {
		const wearable = Wearables[index]
		if (ent.HandleMatches(wearable.AdditionalWearable_)) {
			wearable.AdditionalWearable = undefined
		}
	}
})
