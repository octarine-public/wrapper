import { EventPriority } from "../../Enums/EventPriority"
import { Entity } from "../../Objects/Base/Entity"
import { RoshanSpawner } from "../../Objects/Base/RoshanSpawner"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"

new (class CRoshanSpawnerChanged {
	constructor() {
		EventsSDK.on(
			"EntityCreated",
			this.EntityCreated.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"EntityDestroyed",
			this.EntityDestroyed.bind(this),
			EventPriority.IMMEDIATE
		)
	}
	protected EntityCreated(entity: Entity) {
		this.updateSpawner(entity)
	}
	protected EntityDestroyed(entity: Entity) {
		this.updateSpawner(entity, true)
	}
	private updateSpawner(entity: Entity, destroyed = false) {
		if (entity.Name !== "roshan_location_1" && entity.Name !== "roshan_location_2") {
			return
		}
		const spawner = EntityManager.GetEntitiesByClass(RoshanSpawner)[0]
		if (spawner === undefined) {
			return
		}
		if (entity.Name === "roshan_location_1") {
			spawner.BOTSpawner_ = destroyed ? EntityManager.INVALID_HANDLE : entity.Handle
		}
		if (entity.Name === "roshan_location_2") {
			spawner.TOPSpawner_ = destroyed ? EntityManager.INVALID_HANDLE : entity.Handle
		}
	}
})()
