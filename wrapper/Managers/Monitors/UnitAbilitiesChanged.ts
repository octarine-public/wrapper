import { Ability } from "../../Objects/Base/Ability"
import { Entity } from "../../Objects/Base/Entity"
import { Item } from "../../Objects/Base/Item"
import { Unit, Units } from "../../Objects/Base/Unit"
import { PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { EventsSDK } from "../EventsSDK"
import { Prediction } from "../Prediction/Prediction"

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
					this.setProperty(entity, unit, i)
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
					this.setProperty(entity, unit, i)
					EventsSDK.emit("UnitItemsChanged", false, unit)
					break
				}
			}
		}
	}

	private setProperty(entity: Item | Ability, unit: Unit, abilIndex: number) {
		entity.Owner_ = unit.Handle
		entity.OwnerEntity = unit
		entity.Prediction = new Prediction()
		if (!(entity instanceof Item)) {
			unit.Spells[abilIndex] = entity
			entity.AbilitySlot = abilIndex
			return
		}
		entity.ItemSlot = abilIndex
		unit.TotalItems[abilIndex] = entity
		entity.Purchaser = PlayerCustomData.get(entity.PlayerOwnerID)?.Hero
	}
})()

EventsSDK.on("EntityCreated", ent => Monitor.EntityCreated(ent), Number.MIN_SAFE_INTEGER)
