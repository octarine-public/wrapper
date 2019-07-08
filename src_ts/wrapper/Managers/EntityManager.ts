import { arrayRemove } from "../Utils/ArrayExtensions"

//import * as Debug from "../Utils/Debug";
import Benchmark from "../Utils/BenchMark"

import EventsSDK from "./Events"

import Vector3 from "../Base/Vector3"

import Creep from "../Objects/Base/Creep"
import Entity from "../Objects/Base/Entity"
import Hero from "../Objects/Base/Hero"
import Player from "../Objects/Base/Player"
import Unit from "../Objects/Base/Unit"

import Ability from "../Objects/Base/Ability"
import Item from "../Objects/Base/Item"
import NativeToSDK from "../Objects/NativeToSDK"

import { useQueueModifiers } from "./ModifierManager"

import Building from "../Objects/Base/Building"
import PhysicalItem from "../Objects/Base/PhysicalItem"
import Tower from "../Objects/Base/Tower"

import Game from "../Objects/GameResources/GameRules"
import PlayerResource from "../Objects/GameResources/PlayerResource"
import { HasBit } from "../Utils/Utils"

export { PlayerResource, Game }

//let queueEntities: Entity[] = [];
let queueEntitiesAsMap = new Map<C_BaseEntity, Entity>()

let AllEntities: Entity[] = []
let EntitiesIDs: Entity[] = []
let AllEntitiesAsMap = new Map<C_BaseEntity, Entity>()
let InStage = new Map<C_BaseEntity, Entity>()

export let LocalPlayer: Player

class EntityManager {
	get LocalPlayer(): Player {
		return LocalPlayer
	}
	get LocalHero(): Hero {
		return LocalPlayer !== undefined ? LocalPlayer.Hero : undefined
	}
	get AllEntities(): Entity[] {
		return AllEntities.slice()
	}
	EntityByIndex(index: number): Entity {
		return EntitiesIDs[index]
	}
	GetPlayerByID(playerID: number): Player {
		if (playerID === -1)
			return undefined
		return AllEntities.find(entity => entity instanceof Player && entity.PlayerID === playerID) as Player
	}

	GetEntityByNative(ent: C_BaseEntity, inStage: boolean = false): Entity {
		if (ent === undefined)
			return undefined

		let entityFind = AllEntitiesAsMap.get(ent)

		if (entityFind !== undefined)
			return entityFind

		if (!inStage)
			return undefined

		entityFind = InStage.get(ent)

		if (entityFind !== undefined)
			return entityFind

		return queueEntitiesAsMap.get(ent)
	}

	GetEntitiesByNative(ents: C_BaseEntity[], inStage: boolean = false): Entity[] {
		let entities: Entity[] = []

		// loop-optimizer: FORWARD
		ents.forEach(entNative => {
			let entityFind = AllEntitiesAsMap.get(entNative)

			if (inStage)
				entityFind = entityFind || InStage.get(entNative) || queueEntitiesAsMap.get(entNative)

			if (entityFind !== undefined)
				entities.push(entityFind)
		})

		return entities
	}

	GetEntitiesInRange(vec: Vector3, range: number, filter?: (value: Entity) => boolean): Entity[] {
		return AllEntities.filter(entity => {
			if (entity.Position.Distance(vec) > range)
				return false
			if (filter !== undefined)
				return filter(entity) === true
			return true
		})
	}
}

const entityManager = new EntityManager()

export default global.EntityManager = entityManager

Events.on("EntityCreated", (ent, index) => {

	{ // add globals
		if (ent instanceof C_DOTA_PlayerResource) {
			PlayerResource.m_pBaseEntity = ent
			PlayerResource.m_iIndex = index
			return
		}

		if (ent instanceof C_DOTAGamerulesProxy) {
			Game.m_GameRules = ent.m_pGameRules
			return
		}

		if (ent instanceof C_DOTAGameManagerProxy) {
			Game.m_GameManager = undefined
			return
		}
	}

	const entity = ClassFromNative(ent, index)

	if (LocalPlayer === undefined) {
		queueEntitiesAsMap.set(ent, entity)
		return
	}

	AddToCache(entity)
})

Events.on("EntityDestroyed", (ent, index) => {

	{ // delete global
		if (ent instanceof C_DOTA_PlayerResource) {
			PlayerResource.m_pBaseEntity = undefined
			return
		}

		if (ent instanceof C_DOTAGamerulesProxy) {
			Game.m_GameRules = undefined
			return
		}

		if (ent instanceof C_DOTAGameManagerProxy) {
			Game.m_GameManager = undefined
			return
		}

		if (ent instanceof C_DOTAPlayer && LocalPlayer !== undefined && LocalPlayer.m_pBaseEntity === ent)
			LocalPlayer = undefined
	}

	DeleteFromCache(ent, index)
})

/* ================ RUNTIME CACHE ================ */

function CheckIsInStagingEntity(ent: C_BaseEntity) {
	return HasBit(ent.m_pEntity.m_flags, 2)
}

setInterval(() => {
	if (queueEntitiesAsMap.size > 0) {
		// loop-optimizer: KEEP
		queueEntitiesAsMap.forEach((entity, baseEntity) => {
			if (CheckIsInStagingEntity(baseEntity))
				return

			if (!(baseEntity instanceof C_DOTAPlayer) || !baseEntity.m_bIsLocalPlayer)
				return

			LocalPlayer = entity as Player
			useQueueEntities()
		})
	}

	if (InStage.size > 0) {
		// loop-optimizer: KEEP
		InStage.forEach((entity, baseEntity) => {
			if (CheckIsInStagingEntity(baseEntity))
				return
			InStage.delete(baseEntity)
			AddToCache(entity)
		})
	}
}, 0)

function AddToCache(entity: Entity) {
	//console.log("onEntityPreCreated SDK", entity.m_pBaseEntity, entity.Index);
	EventsSDK.emit("EntityPreCreated", false, entity, entity.Index)

	if (CheckIsInStagingEntity(entity.m_pBaseEntity)) {
		InStage.set(entity.m_pBaseEntity, entity)
		return
	}

	const index = entity.Index

	entity.IsValid = true

	AllEntitiesAsMap.set(entity.m_pBaseEntity, entity)
	EntitiesIDs[index] = entity
	AllEntities.push(entity)

	changeFieldsByEvents(entity as Unit)

	//console.log("onEntityCreated SDK", entity, entity.m_pBaseEntity, index);
	EventsSDK.emit("EntityCreated", false, entity, index)
}

function DeleteFromCache(entNative: C_BaseEntity, index: number) {
	{
		let is_queued_entity = false
		is_queued_entity = queueEntitiesAsMap.delete(entNative) || is_queued_entity
		is_queued_entity = InStage.delete(entNative) || is_queued_entity
		if (is_queued_entity)
			return
	}

	const entity = AllEntitiesAsMap.get(entNative) // EntitiesIDs[index]; ???

	entity.IsValid = false

	AllEntitiesAsMap.delete(entNative)
	delete EntitiesIDs[index]
	arrayRemove(AllEntities, entity)

	//console.log("onEntityDestroyed SDK", entity, entity.m_pBaseEntity, index);
	EventsSDK.emit("EntityDestroyed", false, entity, index)
}

function ClassFromNative(ent: C_BaseEntity, index: number) {
	{
		let constructor = NativeToSDK[ent.constructor.name]
		if (constructor !== undefined)
			return new constructor(ent, index)
	}

	if (ent instanceof C_DOTA_BaseNPC_Tower)
		return new Tower(ent, index)

	if (ent instanceof C_DOTA_BaseNPC_Building)
		return new Building(ent, index)

	if (ent instanceof C_DOTA_BaseNPC_Hero)
		return new Hero(ent, index)

	if (ent instanceof C_DOTA_BaseNPC_Creep)
		return new Creep(ent, index)

	if (ent instanceof C_DOTA_BaseNPC)
		return new Unit(ent, index)

	if (ent instanceof C_DOTA_Item)
		return new Item(ent, index)

	if (ent instanceof C_DOTABaseAbility)
		return new Ability(ent, index)

	if (ent instanceof C_DOTA_Item_Physical)
		return new PhysicalItem(ent, index)

	return new Entity(ent, index)
}

/* ================ QUEUE CACHE ================ */

function useQueueEntities() {
	if (queueEntitiesAsMap.size === 0)
		return

	// loop-optimizer: KEEP
	queueEntitiesAsMap.forEach(entity => {
		AddToCache(entity)

		if (entity instanceof Unit)
			useQueueModifiers(entity)
	})

	queueEntitiesAsMap.clear()
}

/* ================ CHANGE FIELDS ================ */

function changeFieldsByEvents(unit: Unit) {
	if (!(unit instanceof Unit))
		return

	const visibleTagged = unit.IsVisibleForTeamMask

	if (visibleTagged > 0) {

		const isVisibleForEnemies = Unit.IsVisibleForEnemies(unit, visibleTagged)
		unit.IsVisibleForEnemies = isVisibleForEnemies

		EventsSDK.emit("TeamVisibilityChanged", false, unit, isVisibleForEnemies, visibleTagged)
	}
}