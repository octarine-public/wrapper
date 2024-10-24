import { EventPriority } from "../../Enums/EventPriority"
import { Entity } from "../../Objects/Base/Entity"
import { Hero } from "../../Objects/Base/Hero"
import { Item } from "../../Objects/Base/Item"
import { CPlayerResource } from "../../Objects/Base/PlayerResource"
import { TeamData } from "../../Objects/Base/TeamData"
import { Unit } from "../../Objects/Base/Unit"
import { PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"

new (class CPlayerDataCustomChanged {
	private readonly playersItems = new Map<number, Map<number, number>>()

	constructor() {
		EventsSDK.on(
			"GameEvent",
			(name, obj) => this.GameEvent(name, obj),
			EventPriority.IMMEDIATE
		)

		EventsSDK.on(
			"UnitItemsChanged",
			unit => this.UnitItemsChanged(unit),
			EventPriority.IMMEDIATE
		)

		EventsSDK.on(
			"PreEntityCreated",
			entity => this.PreEntityCreated(entity),
			EventPriority.IMMEDIATE
		)

		EventsSDK.on(
			"EntityDestroyed",
			entity => this.EntityDestroyed(entity),
			EventPriority.IMMEDIATE
		)

		EventsSDK.on(
			"PlayerCustomDataUpdated",
			player => this.PlayerCustomDataUpdated(player),
			EventPriority.IMMEDIATE
		)

		EventsSDK.on("PreDataUpdate", () => this.PreDataUpdate(), EventPriority.IMMEDIATE)
	}

	protected PreDataUpdate() {
		const arr = PlayerCustomData.Array
		for (let i = arr.length - 1; i > -1; i--) {
			arr[i].PreDataUpdate()
		}
	}

	protected GameEvent(name: string, obj: any) {
		switch (name) {
			case "dota_buyback":
				PlayerCustomData.get(obj.player_id)?.SetBuyBack()
				break
			case "entity_killed":
				this.lastHitChanged(obj.entindex_killed, obj.entindex_attacker)
				break
		}
	}

	protected PreEntityCreated(entity: Entity) {
		if (entity instanceof TeamData) {
			this.teamDataChanged(entity)
		}
	}

	protected EntityDestroyed(entity: Entity) {
		if (entity instanceof Item) {
			this.destroyedItem(entity)
		}
		if (entity instanceof CPlayerResource) {
			PlayerCustomData.DeleteAll()
		}
		if (entity instanceof TeamData) {
			this.teamDataChanged(entity, true)
		}
		if (!(entity instanceof Hero) || !entity.IsRealHero) {
			return
		}
		this.playersItems.get(entity.PlayerID)?.clear()
		this.playersItems.delete(entity.PlayerID)
		PlayerCustomData.Delete(entity.PlayerID)
	}

	protected PlayerCustomDataUpdated(playerData: PlayerCustomData) {
		if (!playerData.IsValid) {
			this.playersItems.get(playerData.PlayerID)?.clear()
			this.playersItems.delete(playerData.PlayerID)
		}
	}

	protected UnitItemsChanged(unit: Unit) {
		if (unit.IsClone || this.isIllusion(unit)) {
			return
		}
		let playerID = unit.PlayerID
		if (playerID === -1) {
			playerID = unit.OwnerPlayerID // example: courier
		}
		const playerData = PlayerCustomData.get(playerID)
		if (playerData === undefined) {
			return
		}
		if (!playerData.IsValid) {
			this.playersItems.get(playerID)?.clear()
			this.playersItems.delete(playerID)
			return
		}
		const totalItems = this.getTotalItems(unit)
		const oldItems = this.playersItems.get(playerID)
		if (oldItems === undefined) {
			this.playersItems.set(playerID, totalItems)
			this.updateGoldByItems(playerData, totalItems)
			return
		}
		totalItems.forEach((value, key) => oldItems.set(key, value))
		this.updateGoldByItems(playerData, oldItems)
	}

	// TODO: neutral creeps
	private lastHitChanged(indexKilled: number, indexAttacker: number) {
		const target = EntityManager.EntityByIndex(indexKilled)
		const attacker = EntityManager.EntityByIndex(indexAttacker)
		if (!(attacker instanceof Unit)) {
			return
		}
		let playerID = attacker.PlayerID
		if (playerID === -1) {
			playerID = attacker.OwnerPlayerID // example: spirit bear
		}
		const attackerData = PlayerCustomData.get(attacker.PlayerID)
		if (attackerData === undefined || !attackerData.IsValid) {
			return
		}
		if (target === undefined && attacker.IsEnemy() && !attacker.IsVisible) {
			attackerData.LastHitCount++
		}
		if (!(target instanceof Unit) || target.IsHero) {
			return
		}
		if (target.Name === "npc_dota_aether_remnant") {
			return
		}
		if (!attackerData.IsEnemy(target)) {
			attackerData.DenyCount++
			return
		}
		attackerData.LastHitCount++
	}

	private teamDataChanged(entity: TeamData, destroyed = false) {
		if (!destroyed) {
			PlayerCustomData.TeamData.push(entity)
			PlayerCustomData.PlayerCustomDataUpdatedAll()
			return
		}
		PlayerCustomData.TeamData.remove(entity)
		PlayerCustomData.PlayerCustomDataUpdatedAll()
	}

	private destroyedItem(item: Item) {
		const owner = item.Owner
		if (!(owner instanceof Unit) || this.isIllusion(owner) || owner.IsClone) {
			return
		}
		let playerID = owner.PlayerID
		if (playerID === -1) {
			playerID = owner.OwnerPlayerID // example: courier
		}
		const playerData = PlayerCustomData.get(owner.PlayerID)
		if (playerData === undefined || !playerData.IsValid) {
			return
		}
		const oldItems = this.playersItems.get(playerID)
		if (oldItems !== undefined) {
			oldItems.delete(item.Index)
			this.updateGoldByItems(playerData, oldItems)
		}
	}

	private updateGoldByItems(playerData: PlayerCustomData, items: Map<number, number>) {
		let gold = 0
		items.forEach(value => (gold += value))
		playerData.ItemsGold = gold
	}

	private getTotalItems(unit: Unit) {
		const arr = unit.TotalItems
		const newMap = new Map<number, number>()
		for (let i = arr.length - 1; i > -1; i--) {
			const item = arr[i]
			if (item !== undefined && item.Cost > 0) {
				newMap.set(item.Index, item.Cost)
			}
		}
		return newMap
	}

	protected isIllusion(entity: Unit) {
		return entity.IsIllusion || entity.IsStrongIllusion
	}
})()
