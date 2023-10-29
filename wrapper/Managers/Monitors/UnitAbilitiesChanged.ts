import { Ability } from "../../Objects/Base/Ability"
import { Entity } from "../../Objects/Base/Entity"
import { Item } from "../../Objects/Base/Item"
import { Player } from "../../Objects/Base/Player"
import { Unit } from "../../Objects/Base/Unit"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"

const Units = EntityManager.GetEntitiesByClass(Unit)

const Monitor = new (class {
	public OnAbilityChanged(entity: Entity) {
		if (!(entity instanceof Ability)) {
			return
		}

		if (entity instanceof Item) {
			this.OnItemChanged(entity)
			return
		}

		for (const unit of Units) {
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
		for (const unit of Units) {
			for (let i = 0, end = unit.TotalItems_.length; i < end; i++) {
				if (entity.HandleMatches(unit.TotalItems_[i])) {
					unit.TotalItems[i] = entity
					entity.Owner_ = unit.Handle
					entity.OwnerEntity = unit
					if (unit.RootOwner instanceof Player) {
						entity.Purchaser = unit.RootOwner.Hero
					}
					EventsSDK.emit("UnitItemsChanged", false, unit)
					break
				}
			}
		}
	}
})()

EventsSDK.on(
	"EntityCreated",
	ent => Monitor.OnAbilityChanged(ent),
	Number.MIN_SAFE_INTEGER
)
