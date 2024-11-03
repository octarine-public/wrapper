import { EventPriority } from "../../Enums/EventPriority"
import { LifeState } from "../../Enums/LifeState"
import { Entity } from "../../Objects/Base/Entity"
import { Unit } from "../../Objects/Base/Unit"
import { GameState } from "../../Utils/GameState"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"

new (class CEntityChanged {
	constructor() {
		EventsSDK.on(
			"GameEvent",
			(name, obj) => this.GameEvent(name, obj),
			EventPriority.IMMEDIATE
		)
	}

	protected GameEvent(eventName: string, obj: any) {
		const entity = EntityManager.EntityByIndex(obj.entindex_killed)
		switch (eventName) {
			case "entity_hurt":
				this.handleEntityHurt(entity, obj.damage)
				break
			case "entity_killed":
				this.handleEntityKilled(entity)
				break
			case "dota_buyback":
				this.handleDotaBuyback(entity)
				break
			default:
				break
		}
	}

	private handleEntityHurt(entity: Nullable<Entity>, damage: number) {
		if (entity === undefined || entity.IsVisible || !entity.IsAlive) {
			return
		}

		entity.HP = Math.max(Math.round(entity.HP - damage), 1)

		if (entity instanceof Unit) {
			entity.LastDamageTime_ = GameState.RawGameTime
		}
	}

	private handleEntityKilled(entity: Nullable<Entity>) {
		if (entity === undefined) {
			return
		}
		if (entity.IsVisible && entity.LifeState !== LifeState.LIFE_DEAD) {
			entity.LifeState = LifeState.LIFE_DEAD
			entity.HP = 0
			EventsSDK.emit("LifeStateChanged", false, entity)
		}
	}

	private handleDotaBuyback(entity: Nullable<Entity>) {
		if (entity === undefined) {
			return
		}
		if (entity.LifeState === LifeState.LIFE_DEAD) {
			entity.LifeState = LifeState.LIFE_ALIVE
			entity.HP = entity.MaxHP
			EventsSDK.emit("LifeStateChanged", false, entity)
		}
	}
})()
