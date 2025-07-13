import { EventPriority } from "../../Enums/EventPriority"
import { LifeState } from "../../Enums/LifeState"
import { Unit } from "../../Objects/Base/Unit"
import { PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { GameState } from "../../Utils/GameState"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"

new (class CEntityChanged {
	constructor() {
		EventsSDK.on("GameEvent", this.GameEvent.bind(this), EventPriority.IMMEDIATE)
	}

	protected GameEvent(eventName: string, obj: any) {
		switch (eventName) {
			case "entity_hurt":
				this.handleHPChanged(obj)
				break
			case "entity_killed":
				this.handleLifeStateChanged(obj)
				break
			case "dota_buyback":
				this.handleDotaBuyback(obj)
				break
		}
	}
	private handleHPChanged(obj: IEntityHurt) {
		const entity = EntityManager.EntityByIndex(obj.entindex_killed)
		if (entity === undefined || entity.IsVisible || !entity.IsAlive) {
			return
		}

		entity.HP = Math.max(Math.round(entity.HP - obj.damage), 1)

		if (entity instanceof Unit) {
			entity.LastDamageTime_ = GameState.RawGameTime
		}
	}
	private handleLifeStateChanged(obj: IEntityKilled) {
		const entity = EntityManager.EntityByIndex(obj.entindex_killed)
		if (entity === undefined || entity.LifeState === LifeState.LIFE_DEAD) {
			return
		}
		entity.HP = 0
		entity.LifeState = LifeState.LIFE_DEAD
		entity.LastLifeStateUpdate = GameState.RawGameTime
		EventsSDK.emit("LifeStateChanged", false, entity)
	}
	private handleDotaBuyback(obj: IEntityHurt) {
		const entity = EntityManager.EntityByIndex(obj.entindex_killed)
		if (entity === undefined || entity.LifeState !== LifeState.LIFE_DEAD) {
			return
		}
		if (entity instanceof Unit) {
			entity.Mana = entity.MaxMana
			this.setRespawnPosition(entity)
		}
		entity.HP = entity.MaxHP
		entity.LifeState = LifeState.LIFE_ALIVE
		entity.LastLifeStateUpdate = GameState.RawGameTime
		EventsSDK.emit("LifeStateChanged", false, entity)
	}
	private setRespawnPosition(entity: Unit) {
		if (!entity.IsHero) {
			return
		}
		const data = PlayerCustomData.get(entity.PlayerID)
		if (data === undefined || data.RespawnPosition === undefined) {
			return
		}
		entity.SetPosition(data.RespawnPosition)
		entity.PredictedPosition.CopyFrom(data.RespawnPosition)
		entity.FogVisiblePosition.CopyFrom(data.RespawnPosition)
	}
})()
