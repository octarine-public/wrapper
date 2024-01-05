import { Ability } from "../../Objects/Base/Ability"
import { Entity } from "../../Objects/Base/Entity"
import { Item } from "../../Objects/Base/Item"
import { Units } from "../../Objects/Base/Unit"
import { PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { EventsSDK } from "../EventsSDK"

const Monitor = new (class CUnitAbilitiesChanged {
	public EntityCreated(entity: Entity) {
		if (!(entity instanceof Ability)) {
			return
		}
		if (entity instanceof Item) {
			this.OnItemChanged(entity)
			return
		}
		for (let index = Units.length - 1; index > -1; index--) {
			const unit = Units[index]
			for (let i = 0, end = unit.Spells_.length; i < end; i++) {
				if (entity.HandleMatches(unit.Spells_[i])) {
					unit.Spells[i] = entity
					entity.Owner_ = unit.Handle
					entity.OwnerEntity = unit
					EventsSDK.emit("UnitAbilitiesChanged", false, unit)
					break
				}
			}
		}
	}

	private OnItemChanged(entity: Item) {
		for (let index = Units.length - 1; index > -1; index--) {
			const unit = Units[index]
			for (let i = 0, end = unit.TotalItems_.length; i < end; i++) {
				if (entity.HandleMatches(unit.TotalItems_[i])) {
					entity.Slot = i
					unit.TotalItems[i] = entity
					entity.Owner_ = unit.Handle
					entity.OwnerEntity = unit
					entity.Purchaser = PlayerCustomData.get(entity.PlayerOwnerID)?.Hero
					EventsSDK.emit("UnitItemsChanged", false, unit)
					break
				}
			}
		}
	}
})()

EventsSDK.on("EntityCreated", ent => Monitor.EntityCreated(ent), Number.MIN_SAFE_INTEGER)
