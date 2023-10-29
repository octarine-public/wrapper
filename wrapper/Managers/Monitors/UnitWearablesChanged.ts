import { Entity } from "../../Objects/Base/Entity"
import { Unit } from "../../Objects/Base/Unit"
import { Wearable } from "../../Objects/Base/Wearable"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"

const Units = EntityManager.GetEntitiesByClass(Unit)

const Monitor = new (class {
	public OnWearableChanged(entity: Entity) {
		if (!(entity instanceof Wearable)) {
			return
		}

		for (const unit of Units) {
			for (let i = 0, end = unit.MyWearables_.length; i < end; i++) {
				if (
					entity.HandleMatches(unit.MyWearables_[i]) &&
					!unit.MyWearables.includes(entity)
				) {
					unit.MyWearables.push(entity)
					EventsSDK.emit("UnitWearablesChanged", false, unit)
					break
				}
			}
		}
	}
})()

EventsSDK.on(
	"PreEntityCreated",
	ent => Monitor.OnWearableChanged(ent),
	Number.MIN_SAFE_INTEGER
)
