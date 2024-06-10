import { Entity } from "../../Objects/Base/Entity"
import { Hero } from "../../Objects/Base/Hero"
import { Item } from "../../Objects/Base/Item"
import { CPlayerResource } from "../../Objects/Base/PlayerResource"
import { TeamData } from "../../Objects/Base/TeamData"
import { Unit } from "../../Objects/Base/Unit"
import { PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"

const Monitor = new (class CPlayerDataCustomChanged {
	private readonly playersItems = new Map<number, Item[]>()

	protected IsIllusion(entity: Unit) {
		return entity.IsIllusion || entity.IsStrongIllusion
	}

	// Events
	public PostDataUpdate() {
		const arr = PlayerCustomData.Array
		for (let index = arr.length - 1; index > -1; index--) {
			arr[index].PostDataUpdate()
		}
	}

	// Events
	public GameEvent(name: string, obj: any) {
		switch (name) {
			case "dota_buyback":
				PlayerCustomData.get(obj.player_id)?.SetBuyBack()
				break
			case "entity_killed":
				this.lastHitChanged(obj.entindex_killed, obj.entindex_attacker)
				break
		}
	}

	// Events
	public PreEntityCreated(entity: Entity) {
		if (entity instanceof TeamData) {
			this.teamDataChanged(entity)
		}
	}

	// Events
	public EntityDestroyed(entity: Entity) {
		if (entity instanceof CPlayerResource) {
			PlayerCustomData.DeleteAll()
		}
		if (entity instanceof TeamData) {
			this.teamDataChanged(entity, true)
		}
		if (entity instanceof Hero && entity.IsRealHero) {
			this.playersItems.get(entity.PlayerID)?.clear()
			this.playersItems.delete(entity.PlayerID)
			PlayerCustomData.Delete(entity.PlayerID)
		}
		if (entity instanceof Item) {
			this.destroyedItem(entity)
		}
	}

	// Events
	public PlayerCustomDataUpdated(playerData: PlayerCustomData) {
		if (!playerData.IsValid) {
			this.playersItems.get(playerData.PlayerID)?.clear()
			this.playersItems.delete(playerData.PlayerID)
		}
	}

	// Events
	public UnitItemsChanged(unit: Unit) {
		if (!unit.IsEnemy() || unit.IsClone || this.IsIllusion(unit)) {
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
		// typescript 5.5 fix type (item is Item | undefined)
		const totalItems = unit.TotalItems.filter(
			(item): item is Item => item !== undefined && item.Cost !== 0
		)
		const oldItems = this.playersItems.get(playerID)
		if (oldItems === undefined) {
			this.playersItems.set(playerID, totalItems)
			this.updateGoldByItems(playerData, totalItems)
			return
		}
		for (let index = totalItems.length - 1; index > -1; index--) {
			const item = totalItems[index]
			if (!oldItems.includes(item)) {
				oldItems.push(item)
			}
		}
		this.updateGoldByItems(playerData, oldItems)
	}

	// TODO: neutral creeps
	private lastHitChanged(indexKilled: number, indexAttacker: number) {
		const target = EntityManager.EntityByIndex(indexKilled)
		const attacker = EntityManager.EntityByIndex(indexAttacker)
		if (!(target instanceof Unit) || !(attacker instanceof Unit)) {
			return
		}
		if (target.Name === "npc_dota_aether_remnant") {
			return
		}
		if (target.IsBuilding || target.IsHero || target.IsRoshan) {
			return
		}
		if (target.IsClone || target.IsIllusion || target.IsCourier) {
			return
		}
		const attackerData = PlayerCustomData.get(attacker.PlayerID)
		if (attackerData === undefined || !attackerData.IsValid) {
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
		if (!(owner instanceof Unit)) {
			return
		}
		if (!owner.IsEnemy() || owner.IsClone || this.IsIllusion(owner)) {
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
		if (oldItems === undefined) {
			return
		}
		oldItems.remove(item)
		this.updateGoldByItems(playerData, oldItems)
	}

	private updateGoldByItems(playerData: PlayerCustomData, items: Item[]) {
		playerData.ItemsGold = items.reduce((sum, item) => sum + item.Cost, 0)
	}
})()

EventsSDK.on("PostDataUpdate", () => Monitor.PostDataUpdate())

EventsSDK.on(
	"UnitItemsChanged",
	entity => Monitor.UnitItemsChanged(entity),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"PreEntityCreated",
	entity => Monitor.PreEntityCreated(entity),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"PlayerCustomDataUpdated",
	player => Monitor.PlayerCustomDataUpdated(player),
	Number.MIN_SAFE_INTEGER
)
