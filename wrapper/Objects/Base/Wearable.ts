import { WrapperClass } from "../../Decorators"
import { ItemHealthBarOffsets, ItemNames } from "../../Managers/EconHelper"
import EntityManager from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import Entity from "./Entity"

@WrapperClass("CEconWearable")
export default class Wearable extends Entity {
	public ItemDefinitionIndex = 0n
	public ItemName = ""
	public HealthBarOffset: Nullable<number>
	public AdditionalWearable: Nullable<Wearable>
	public AdditionalWearable_ = 0

	public get Name() {
		return this.ItemName
	}
	public Update() {
		this.ItemName = ItemNames.get(this.ItemDefinitionIndex) ?? ""
		this.HealthBarOffset = ItemHealthBarOffsets.get(this.ItemDefinitionIndex)
	}
}
const Wearables = EntityManager.GetEntitiesByClass(Wearable)

import { RegisterFieldHandler } from "../NativeToSDK"

RegisterFieldHandler(Wearable, "m_iItemDefinitionIndex", (ent, new_val) => {
	ent.ItemDefinitionIndex = new_val as bigint
	ent.Update()
})
RegisterFieldHandler(Wearable, "m_hAdditionalWearable", (ent, new_val) => {
	ent.AdditionalWearable_ = new_val as number
	ent.AdditionalWearable = EntityManager.EntityByIndex(ent.Owner_) as Nullable<Wearable>
})
EventsSDK.on("PreEntityCreated", ent => {
	if (ent.Index === 0)
		return
	if (ent instanceof Wearable)
		for (const wearable of Wearables)
			if (ent.HandleMatches(wearable.AdditionalWearable_))
				wearable.AdditionalWearable = ent
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent.Index === 0)
		return
	if (ent instanceof Wearable)
		for (const wearable of Wearables)
			if (ent.HandleMatches(wearable.AdditionalWearable_))
				wearable.AdditionalWearable = undefined
})
EventsSDK.on("EconDataLoaded", () => {
	for (const wearable of Wearables)
		wearable.Update()
})
