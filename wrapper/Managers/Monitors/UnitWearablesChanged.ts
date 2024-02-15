import { Entity } from "../../Objects/Base/Entity"
import { Units } from "../../Objects/Base/Unit"
import { Wearable } from "../../Objects/Base/Wearable"
import { EventsSDK } from "../EventsSDK"

const Monitor = new (class CUnitWearablesChanged {
	public PreEntityCreated(entity: Entity) {
		if (!(entity instanceof Wearable)) {
			return
		}
		for (let index = Units.length - 1; index > -1; index--) {
			const unit = Units[index]
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
	ent => Monitor.PreEntityCreated(ent),
	Number.MIN_SAFE_INTEGER
)
