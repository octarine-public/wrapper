import { EventPriority } from "../../Enums/EventPriority"
import { Entity } from "../../Objects/Base/Entity"
import { PhysicalItem } from "../../Objects/Base/PhysicalItem"
import { Rune } from "../../Objects/Base/Rune"
import { Unit } from "../../Objects/Base/Unit"
import { EventsSDK } from "../EventsSDK"

new (class CEntityVisibleChanged {
	private readonly entities = new Map<Entity, [boolean]>()

	constructor() {
		EventsSDK.on(
			"PreDataUpdate",
			this.PreDataUpdate.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"PreEntityCreated",
			this.PreEntityCreated.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"EntityDestroyed",
			this.EntityDestroyed.bind(this),
			EventPriority.IMMEDIATE
		)
	}

	protected PreDataUpdate() {
		this.entities.forEach((entData, entity) => {
			if (entData[0] !== entity.IsVisible) {
				entData[0] = entity.IsVisible
				EventsSDK.emit("EntityVisibleChanged", false, entity)
			}
		})
	}

	public PreEntityCreated(entity: Entity) {
		if (this.allowEntity(entity)) {
			this.entities.set(entity, [entity.IsVisible])
			EventsSDK.emit("EntityVisibleChanged", false, entity)
		}
	}

	public EntityDestroyed(entity: Entity) {
		if (this.allowEntity(entity)) {
			EventsSDK.emit("EntityVisibleChanged", false, entity)
			this.entities.delete(entity)
		}
	}

	private allowEntity(entity: Entity) {
		return (
			entity instanceof Unit ||
			entity instanceof Rune ||
			entity instanceof PhysicalItem
		)
	}
})()
