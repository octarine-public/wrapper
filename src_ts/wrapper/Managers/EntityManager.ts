import { arrayRemove } from "../Utils/ArrayExtensions"

// import * as Debug from "../Utils/Debug"

import Events from "./Events"

import Vector3 from "../Base/Vector3"

import Creep from "../Objects/Base/Creep"
import Entity from "../Objects/Base/Entity"
import Hero from "../Objects/Base/Hero"
import Player from "../Objects/Base/Player"
import Unit from "../Objects/Base/Unit"

import Ability from "../Objects/Base/Ability"
import Item from "../Objects/Base/Item"
import NativeToSDK from "../Objects/NativeToSDK"

import Building from "../Objects/Base/Building"
import PhysicalItem from "../Objects/Base/PhysicalItem"
import Tower from "../Objects/Base/Tower"

import AbilityData from "../Objects/DataBook/AbilityData"
import Game from "../Objects/GameResources/GameRules"
import PlayerResource from "../Objects/GameResources/PlayerResource"
import { HasBit } from "../Utils/BitsExtensions"
import EventsSDK from "./EventsSDK"

export { PlayerResource, Game }

let AllEntities: Entity[] = []
let EntitiesIDs = new Map<number, Entity>()
let AllEntitiesAsMap = new Map<C_BaseEntity, Entity>()
let InStage = new Map<C_BaseEntity, Entity>()

export let LocalPlayer: Player
export function SetLocalPlayer(player: Player) {
	LocalPlayer = player
}

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
	public EntityByIndex(index: number): Entity {
		return EntitiesIDs.get(index)
	}
	public GetPlayerByID(playerID: number): Player {
		if (playerID === -1)
			return undefined
		return AllEntities.find(entity => entity instanceof Player && entity.PlayerID === playerID) as Player
	}

	public GetEntityByNative(ent: C_BaseEntity | number, inStage: boolean = false): Entity {
		if (ent === undefined)
			return undefined
		if (!(ent instanceof C_BaseEntity))
			return this.EntityByIndex(ent)

		let entityFind = AllEntitiesAsMap.get(ent)
		if (inStage)
			entityFind = entityFind || InStage.get(ent)

		return entityFind
	}

	public GetEntityByFilter(filter: (ent: Entity) => boolean, inStage: boolean = false): Entity {
		let found = AllEntities.find(filter)
		if (found !== undefined)
			return found

		if (!inStage)
			return undefined

		// loop-optimizer: KEEP
		InStage.forEach((ent, _) => {
			if (found === undefined && filter(ent))
				found = ent
		})

		return found
	}

	public GetEntitiesByNative(ents: (C_BaseEntity | Entity | number)[], inStage: boolean = false): (Entity | any)[] {
		// loop-optimizer: FORWARD
		return ents.map(ent => {
			if (ent instanceof Entity)
				return ent
			if (!(ent instanceof C_BaseEntity))
				return this.EntityByIndex(ent)
			let ent_ = AllEntitiesAsMap.get(ent)
			if (inStage)
				ent_ = ent_ || InStage.get(ent)
			return ent_ || ent
		})
	}

	public GetEntitiesInRange(vec: Vector3, range: number, filter?: (value: Entity) => boolean): Entity[] {
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
		if (ent instanceof C_DOTA_PlayerResource)
			PlayerResource.m_pBaseEntity = ent

		if (ent instanceof C_DOTAGamerulesProxy) {
			Game.m_GameRules = ent.m_pGameRules
			Game.RawGameTime = Game.m_GameRules.m_fGameTime
			Game.IsPaused = Game.m_GameRules.m_bGamePaused
		}

		if (ent instanceof C_DOTAGameManagerProxy)
			Game.m_GameManager = ent.m_pGameManager
	}

	const entity = ClassFromNative(ent, index)
	AddToCache(entity)
})

Events.on("EntityDestroyed", (ent, index) => {
	{ // delete global
		if (ent instanceof C_DOTA_PlayerResource)
			PlayerResource.m_pBaseEntity = undefined

		if (ent instanceof C_DOTAGamerulesProxy) {
			Game.m_GameRules = undefined
			Game.RawGameTime = 0
			Game.IsPaused = false
		}

		if (ent instanceof C_DOTAGameManagerProxy)
			Game.m_GameManager = undefined

		if (ent instanceof C_DOTAPlayer && LocalPlayer !== undefined && LocalPlayer.m_pBaseEntity === ent)
			LocalPlayer = undefined
	}

	DeleteFromCache(ent, index)
})

/* ================ RUNTIME CACHE ================ */

function CheckIsInStagingEntity(ent: C_BaseEntity) {
	let ent_ = ent.m_pEntity
	return ent_ === undefined || HasBit(ent_.m_flags, 2)
}

setInterval(() => {
	// loop-optimizer: KEEP
	InStage.forEach((entity, baseEntity) => {
		if (CheckIsInStagingEntity(baseEntity))
			return
		InStage.delete(baseEntity)
		AddToCache(entity)
	})
}, 5)

function AddToCache(entity: Entity) {
	const index = entity.Index
	EntitiesIDs.set(index, entity)
	if (CheckIsInStagingEntity(entity.m_pBaseEntity)) {
		InStage.set(entity.m_pBaseEntity, entity)
		return
	}
	if (entity instanceof Player && entity.m_pBaseEntity.m_bIsLocalPlayer)
		LocalPlayer = entity as Player

	entity.OnCreated()
	AllEntitiesAsMap.set(entity.m_pBaseEntity, entity)
	AllEntities.push(entity)

	// console.log("onEntityCreated SDK", entity, entity.m_pBaseEntity, index);
	InitEntityFields(entity)
	EventsSDK.emit("EntityCreated", false, entity, index)
	FireEntityEvents(entity)
}

let gameInProgress = false
setInterval(() => {
	let old_val = Game.IsConnected
	Game.IsConnected = IsInGame()
	if (old_val && !Game.IsConnected) {
		gameInProgress = false
		EventsSDK.emit("GameEnded", false)
		Player.order_queue = []
		Particles.DeleteAll()
	} else if (!gameInProgress && Game.IsConnected && Game.IsInGame && LocalPlayer !== undefined && LocalPlayer.HeroAssigned) {
		gameInProgress = true
		EventsSDK.emit("GameStarted", false, LocalPlayer.Hero)
	}
}, 20)

function DeleteFromCache(entNative: C_BaseEntity, index: number) {
	{
		let is_queued_entity = false
		is_queued_entity = InStage.delete(entNative) || is_queued_entity
		if (is_queued_entity)
			return
	}

	const entity = AllEntitiesAsMap.get(entNative)

	entity.IsValid = false

	AllEntitiesAsMap.delete(entNative)
	EntitiesIDs.delete(index)
	arrayRemove(AllEntities, entity)

	// console.log("onEntityDestroyed SDK", entity, entity.m_pBaseEntity, index);
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

/* ================ CHANGE FIELDS ================ */

function InitEntityFields(ent: Entity) {
	ent.MaxHP = ent.m_pBaseEntity.m_iMaxHealth
	ent.HP = ent.m_pBaseEntity.m_iHealth
	ent.LifeState = ent.m_pBaseEntity.m_lifeState
	ent.Team = ent.m_pBaseEntity.m_iTeamNum
	ent.Owner_ = ent.m_pBaseEntity.m_hOwnerEntity
	if (ent.Entity !== undefined)
		ent.Name_ = ent.Entity.m_name || ent.Entity.m_designerName || ""
	if (ent instanceof Unit) {
		ent.RotationDifference = ent.m_pBaseEntity.m_anglediff
		ent.ManaRegen = ent.m_pBaseEntity.m_flManaThinkRegen
		ent.HPRegen = ent.m_pBaseEntity.m_flHealthThinkRegen
		ent.IsControllableByPlayerMask = ent.m_pBaseEntity.m_iIsControllableByPlayer64
		ent.IsVisibleForTeamMask = ent.m_pBaseEntity.m_iTaggedAsVisibleByTeam
		ent.IsVisibleForEnemies = Unit.IsVisibleForEnemies(ent)
		ent.NetworkActivity = ent.m_pBaseEntity.m_NetworkActivity
		ent.LastVisibleTime = Game.RawGameTime;
	}
	if (ent instanceof Ability) {
		ent.LastCastClickTime = ent.m_pBaseEntity.m_flLastCastClickTime
		ent.IsToggled = ent.m_pBaseEntity.m_bToggleState
		ent.ChannelStartTime = ent.m_pBaseEntity.m_flChannelStartTime
		ent.CastStartTime = ent.m_pBaseEntity.m_flCastStartTime
		ent.IsInAbilityPhase = ent.m_pBaseEntity.m_bInAbilityPhase
		ent.CooldownLength = ent.m_pBaseEntity.m_flCooldownLength
		ent.Cooldown = ent.m_pBaseEntity.m_fCooldown
		ent.Level = ent.m_pBaseEntity.m_iLevel
		let m_pAbilityData = ent.m_pBaseEntity.m_pAbilityData
		if (m_pAbilityData !== undefined)
			ent.AbilityData = new AbilityData(m_pAbilityData)
	}
}
function FireEntityEvents(ent: Entity) {
	EventsSDK.emit("LifeStateChanged", false, ent)
	if (ent instanceof Unit) {
		EventsSDK.emit("TeamVisibilityChanged", false, ent)
		EventsSDK.emit("NetworkActivityChanged", false, ent)
	}
}
