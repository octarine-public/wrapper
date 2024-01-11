import { Entity } from "../../Objects/Base/Entity"
import { PhysicalItem } from "../../Objects/Base/PhysicalItem"
import { Rune } from "../../Objects/Base/Rune"
import { Unit } from "../../Objects/Base/Unit"
import { EventsSDK } from "../EventsSDK"

const Monitor = new (class CEntityVisibleChanged {
	private readonly entities = new Map<Entity, [boolean]>()

	public PreDataUpdate() {
		this.entities.forEach((entData, ent) => {
			if (entData[0] !== ent.IsVisible) {
				entData[0] = ent.IsVisible
				EventsSDK.emit("EntityVisibleChanged", false, ent)
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

EventsSDK.on("PreDataUpdate", () => Monitor.PreDataUpdate(), Number.MIN_SAFE_INTEGER)

EventsSDK.on(
	"PreEntityCreated",
	entity => Monitor.PreEntityCreated(entity),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"EntityDestroyed",
	entity => Monitor.EntityDestroyed(entity),
	Number.MIN_SAFE_INTEGER
)
