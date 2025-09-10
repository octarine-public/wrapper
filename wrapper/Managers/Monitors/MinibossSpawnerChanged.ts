import { EventPriority } from "../../Enums/EventPriority"
import { Entity } from "../../Objects/Base/Entity"
import { MinibossLocation1 } from "../../Objects/Base/MinibossLocation1"
import { MinibossLocation2 } from "../../Objects/Base/MinibossLocation2"
import { MinibossSpawner } from "../../Objects/Base/MinibossSpawner"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"

new (class CMiniBossSpawnerChanged {
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
		const isLocation =
			entity instanceof MinibossLocation1 || entity instanceof MinibossLocation2
		if (!isLocation) {
			return
		}
		const spawner = EntityManager.GetEntitiesByClass(MinibossSpawner)[0]
		if (spawner === undefined) {
			return
		}
		if (entity instanceof MinibossLocation1) {
			spawner.BOTSpawner_ = destroyed ? EntityManager.INVALID_HANDLE : entity.Handle
		}
		if (entity instanceof MinibossLocation2) {
			spawner.TOPSpawner_ = destroyed ? EntityManager.INVALID_HANDLE : entity.Handle
		}
	}
})()
